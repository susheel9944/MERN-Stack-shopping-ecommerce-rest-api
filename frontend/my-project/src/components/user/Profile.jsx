import { useSelector } from "react-redux";
import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("user detail----", user);
  const date = new Date(user?.createdAt);

  const indianDate = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  console.log("user detail---- susheel", indianDate);

  return (
    <>
      <UserLayout>
        <MetaData title={"profile"} />
        <div className="row justify-content-around mt-5 user-info">
          <div className="col-12 col-md-3">
            <figure className="avatar avatar-profile">
              <img
                className="rounded-circle img-fluid"
                src={
                  user?.avatar
                    ? user?.avatar?.url
                    : "/images/default_avatar.jpg"
                }
                alt={user?.name}
              />
            </figure>
          </div>

          <div className="col-12 col-md-5">
            <h4>Full Name</h4>
            <p>{user?.name}</p>

            <h4>Email Address</h4>
            <p>{user?.email}</p>

            <h4>Joined On</h4>
            <p>{indianDate}</p>
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default Profile;
