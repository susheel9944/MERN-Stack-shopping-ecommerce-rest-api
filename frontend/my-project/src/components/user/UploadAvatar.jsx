import { useEffect, useState } from "react";
import { useUploadAvatarMutation } from "../../redux/userApi";
import UserLayout from "../layout/UserLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UploadAvatar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg",
  );

  const [uploadAvatar, { isLoading, error, isSuccess }] =
    useUploadAvatarMutation();

  const handleOnchange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      avatar,
    };

    console.log("avatar user data++++++++++=", userData);
    try {
      const res = await uploadAvatar(userData).unwrap();
      console.log("SUCCESS:", res);

      toast.success("Avatar Uploaded");
      navigate("/me/profile");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Upload failed");
    }
    // uploadAvatar(userData);
  };
  return (
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow rounded bg-body" onSubmit={handleSubmit}>
            <h2 className="mb-4">Upload Avatar</h2>

            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <figure className="avatar item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="image"
                    />
                  </figure>
                </div>
                <div className="input-foam">
                  <label className="form-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="customFile"
                    accept="images/*"
                    onChange={handleOnchange}
                  />
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Uloading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadAvatar;
