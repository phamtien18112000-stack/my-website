export const PACKAGE_ID = "0xf532f4858b8c4e173810d0b685a81de0b7de0e318e3617743459ea460d70a8c3";
export const PLATFORM_ID = "0x0"; // Update sau khi deploy

export const MIST_PER_SUI = 1_000_000_000;

export const formatSUI = (mist: string | number): string => {
  return (Number(mist) / MIST_PER_SUI).toFixed(4);
};

export const toMist = (sui: string | number): number => {
  return Math.floor(Number(sui) * MIST_PER_SUI);
};

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: string;
  current_amount: string;
  deadline: string;
  is_active: boolean;
  owner: string;
}