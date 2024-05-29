import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/provider",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Services",
    path: "/dashboard/my-services",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscTools",
  },
  {
    id: 4,
    name: "My Rental Items",
    path: "/dashboard/my-rents",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscCallIncoming",
  },
  {
    id: 5,
    name: "My Products",
    path: "/dashboard/my-products",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscVerifiedFilled",
  },
  {
    id: 6,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.USER,
    icon: "VscArchive",
  },
  {
    id: 7,
    name: "Wishlist",
    path: "/dashboard/wishlist",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHeartFilled",
  },
  {
    id: 8,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHistory",
  },
  {
    id: 9,
    name: "Dashboard",
    path: "/dashboard/admin",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscDashboard",
  },
  {
    id: 10,
    name: "My Categories",
    path: "/dashboard/my-categories",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscTasklist",
  },
  {
    id: 11,
    name: "Add Category",
    path: "/dashboard/add-category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 12,
    name: "Add",
    path: "/dashboard/add",
    type: ACCOUNT_TYPE.PROVIDER,
    icon: "VscAdd", 
  }
]
