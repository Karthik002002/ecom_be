import { ProductRouter } from "./ProductRoutes.js";
import { UserRouter } from "./User.js";

export const MainRoute = [
  { path: "/user", route: UserRouter },
  { path: "/product", route: ProductRouter },
];
