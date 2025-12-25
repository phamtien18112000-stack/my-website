module charity::charity_platform {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;

    // ========== STRUCTS ==========

    /// Global registry để lưu tất cả campaigns
    public struct CampaignRegistry has key {
        id: UID,
        campaigns: vector<ID>,
    }

    /// Campaign object - mỗi campaign là 1 shared object
    public struct Campaign has key, store {
        id: UID,
        title: vector<u8>,
        description: vector<u8>,
        creator: address,
        goal: u64,
        raised: Balance<SUI>,
        deadline: u64,
        beneficiary: address,
        created_at: u64,
    }

    // ========== EVENTS ==========

    public struct CampaignCreated has copy, drop {
        campaign_id: ID,
        creator: address,
        title: vector<u8>,
        goal: u64,
        deadline: u64,
    }

    public struct DonationReceived has copy, drop {
        campaign_id: ID,
        donor: address,
        amount: u64,
        new_total: u64,
    }

    public struct FundsWithdrawn has copy, drop {
        campaign_id: ID,
        recipient: address,
        amount: u64,
    }

    // ========== INITIALIZATION ==========

    /// Initialize registry khi deploy contract
    fun init(ctx: &mut TxContext) {
        let registry = CampaignRegistry {
            id: object::new(ctx),
            campaigns: vector::empty(),
        };
        transfer::share_object(registry);
    }

    // ========== PUBLIC FUNCTIONS ==========

    /// Tạo campaign mới
    public entry fun create_campaign(
        registry: &mut CampaignRegistry,
        title: vector<u8>,
        description: vector<u8>,
        goal: u64,
        deadline: u64,
        beneficiary: address,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(goal > 0, 1); // Goal phải > 0
        assert!(deadline > tx_context::epoch_timestamp_ms(ctx), 2); // Deadline phải trong tương lai
        assert!(vector::length(&title) > 0, 3); // Title không được rỗng

        let campaign_uid = object::new(ctx);
        let campaign_id = object::uid_to_inner(&campaign_uid);

        let campaign = Campaign {
            id: campaign_uid,
            title,
            description,
            creator: tx_context::sender(ctx),
            goal,
            raised: balance::zero(),
            deadline,
            beneficiary,
            created_at: tx_context::epoch_timestamp_ms(ctx),
        };

        // Thêm campaign ID vào registry
        vector::push_back(&mut registry.campaigns, campaign_id);

        // Emit event
        event::emit(CampaignCreated {
            campaign_id,
            creator: tx_context::sender(ctx),
            title: campaign.title,
            goal,
            deadline,
        });

        // Share campaign object để mọi người có thể donate
        transfer::share_object(campaign);
    }

    /// Donate vào campaign
    public entry fun donate(
        campaign: &mut Campaign,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Validation
        let amount = coin::value(&payment);
        assert!(amount > 0, 4); // Amount phải > 0
        assert!(tx_context::epoch_timestamp_ms(ctx) < campaign.deadline, 5); // Chưa hết hạn

        // Thêm tiền vào campaign balance
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut campaign.raised, coin_balance);

        let new_total = balance::value(&campaign.raised);

        // Emit event
        event::emit(DonationReceived {
            campaign_id: object::uid_to_inner(&campaign.id),
            donor: tx_context::sender(ctx),
            amount,
            new_total,
        });
    }

    /// Withdraw funds (chỉ creator hoặc beneficiary)
    public entry fun withdraw_funds(
        campaign: &mut Campaign,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Chỉ creator hoặc beneficiary mới được rút
        assert!(
            sender == campaign.creator || sender == campaign.beneficiary,
            6
        );

        let total_raised = balance::value(&campaign.raised);
        assert!(total_raised > 0, 7); // Phải có tiền mới rút được

        // Rút toàn bộ số tiền
        let withdrawn = balance::withdraw_all(&mut campaign.raised);
        let coin = coin::from_balance(withdrawn, ctx);

        // Transfer cho beneficiary
        transfer::public_transfer(coin, campaign.beneficiary);

        // Emit event
        event::emit(FundsWithdrawn {
            campaign_id: object::uid_to_inner(&campaign.id),
            recipient: campaign.beneficiary,
            amount: total_raised,
        });
    }

    // ========== VIEW FUNCTIONS ==========

    /// Get campaign details (frontend sẽ dùng để query)
    public fun get_campaign_info(campaign: &Campaign): (
        vector<u8>, // title
        vector<u8>, // description
        address,    // creator
        u64,        // goal
        u64,        // raised
        u64,        // deadline
        address,    // beneficiary
        u64         // created_at
    ) {
        (
            campaign.title,
            campaign.description,
            campaign.creator,
            campaign.goal,
            balance::value(&campaign.raised),
            campaign.deadline,
            campaign.beneficiary,
            campaign.created_at
        )
    }

    /// Get total number of campaigns
    public fun get_campaigns_count(registry: &CampaignRegistry): u64 {
        vector::length(&registry.campaigns)
    }

    // ========== TEST HELPER ==========
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}