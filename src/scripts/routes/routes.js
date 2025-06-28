import HomePage from "../pages/home/home-page";
import Bookmark from "../pages/bookmark/bookmark-page";
import AboutPage from "../pages/about/about-page";
import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";
import {
  checkUnauthenticatedRouteOnly,
  checAuthenticatedRoute,
} from "../utils/auth";
import NewPage from "../pages/new/new-page";
const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/": () => checAuthenticatedRoute(new HomePage()),
  "/stories": () => checAuthenticatedRoute(new NewPage()),
  "/bookmark": () => checAuthenticatedRoute(new Bookmark()),
};

export default routes;
