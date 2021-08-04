import React from "react";
import { Switch } from "react-router-dom";
import WithErrors from "./hocs/WithErrors";
import PublicRoute from "./routes/publicRoutes";
import PrivateRoute from "./routes/privateRoutes";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/public/ProfilePage";
import PasswordForgot from "./pages/auth/PasswordForgot";
import PasswordReset from "./pages/auth/PasswordReset";
import ChangePassword from "./pages/auth/ChangePass";
import SellPage from "./pages/tokens/SellPage";
import BuyPage from "./pages/tokens/BuyPage";
import Users from "./pages/admin/Users";
import PendingUsers from "./pages/admin/PendingUsers";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import BasicInfoForm from "./pages/Profile-edit/BasicInfoForm";
import RejectedUsers from "./pages/admin/RejectedUsers";
import NidPage from "./pages/public/NidPage";
import PassportPage from "./pages/public/PassportPage";
import DrivingPage from "./pages/public/DrivingPage";
import Order from "./pages/Orders/Order";
import UnappliedUsers from "./pages/admin/UnappliedUsers";
import EditUserTab from "./pages/admin/EditUserTab";
import ReferralPurchase from "./pages/referral/ReferralPurchase";
import ReferralPurchaseHistory from "./pages/referral/ReferralPurchaseHistory";
import UpdatePrice from "./pages/referral/UpdatePrice";
import MlmPage from "./pages/Mlm/MlmPage";
import ReferralRewardHistory from "./pages/referral/ReferraRewardHistory";
import TriggerPage from "./pages/GoldPoints/GPAdmin/TriggerPage";
import GoldPointPurchase from "./pages/GoldPoints/GP User/GoldPointPurchase";
import GoldPointPurchaseHistory from "./pages/GoldPoints/GP User/GoldPointPurchaseHIstory";
import AdminExchangeRate from "./pages/GoldPoints/GPAdmin/GpAdminExchangeRate";
import AdminExchangeHistory from "./pages/GoldPoints/GPAdmin/GpAdminExchangeHistory";
import EmailJs from "./pages/Email/email";

const App = () => (
  <Switch>
    <PublicRoute restricted={false} component={HomePage} path="/" exact />
    <PublicRoute restricted={false} component={Signin} path="/signin" exact />
    <PublicRoute restricted={false} component={Signup} path="/signup" exact />
    <PublicRoute
      restricted={false}
      component={PasswordForgot}
      path="/forgot-password"
      exact
    />
    <PublicRoute
      restricted={false}
      component={PasswordReset}
      path="/reset-password"
      exact
    />

    <PrivateRoute component={EmailJs} path="/emails" />
    <PrivateRoute component={Profile} path="/profile/:id" />
    <PrivateRoute component={Dashboard} path="/dashboard" />
    <PrivateRoute component={Order} path="/orders" />
    <PrivateRoute component={TriggerPage} path="/trigger-gold-points" />
    <PrivateRoute component={GoldPointPurchase} path="/gp-purchase" />
    <PrivateRoute component={GoldPointPurchaseHistory} path="/gp-history" />
    <PrivateRoute component={AdminExchangeRate} path="/gp-exchange-rate" />
    <PrivateRoute
      component={AdminExchangeHistory}
      path="/gp-exchange-history"
    />

    <PrivateRoute component={Profile} path="/profile" />
    <PrivateRoute component={BasicInfoForm} path="/profile-edit" />
    <PrivateRoute component={NidPage} path="/edit-nid" />
    <PrivateRoute component={PassportPage} path="/edit-passport" />
    <PrivateRoute component={DrivingPage} path="/edit-driving" />
    <PrivateRoute component={ChangePassword} path="/edit-password" />

    <PrivateRoute component={ReferralPurchase} path="/referral-purchase" />
    <PrivateRoute component={UpdatePrice} path="/update-price" />

    <PrivateRoute
      component={ReferralPurchaseHistory}
      path="/referral-purchase-history"
    />
    <PrivateRoute
      component={ReferralRewardHistory}
      path="/referral-reward-history"
    />

    <PrivateRoute component={BuyPage} path="/buy" exact />
    <PrivateRoute component={SellPage} path="/send" exact />
    <PrivateRoute component={MlmPage} path="/members" exact />

    <PrivateRoute component={Users} path="/users" exact />
    <PrivateRoute component={EditUserTab} path="/user/:id/edit" exact />
    <PrivateRoute component={PendingUsers} path="/pending-users" exact />
    <PrivateRoute component={UnappliedUsers} path="/unapplied-users" exact />
    <PrivateRoute component={RejectedUsers} path="/rejected-users" exact />
  </Switch>
);

export default WithErrors(App);
