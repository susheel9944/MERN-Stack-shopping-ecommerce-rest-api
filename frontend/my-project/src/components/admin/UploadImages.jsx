import AdminLayout from "../layout/AdminLayout";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import { useEffect, useRef, useState } from "react";
import {
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/productAPi";
import { useNavigate, useParams } from "react-router-dom";

const UploadImages = () => {
  const imgRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadProductImages, { error, isLoading, isSuccess }] =
    useUploadProductImagesMutation();

  const [
    deleteProductImage,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteProductImageMutation();
  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      setUploadImages(data?.product?.images);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      setImagesPreview([]);
      toast.success("Images Uploaded");
      navigate("/admin/products");
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
  }, [data, error, isSuccess, deleteError]);

  const handleOnchange = (e) => {
    const files = Array.from(e.target.files);
    const reader = new FileReader();

    files.forEach((file) => {
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleResetFile = () => {
    if (imgRef.current) {
      imgRef.current = "";
    }
  };

  const handleUploadedImageDelete = (image) => {
    const filteredImages = imagesPreview.filter((img) => img != image);
    setImages(filteredImages);
    setImagesPreview(filteredImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadProductImages({ id: params?.id, body: { images } });
  };

  const deleteImage = (imgId) => {
    console.log("Deleting:", imgId); // debug
    deleteProductImage({ id: params?.id, imgId });
  };

  console.log("image ++++++++++++", imagesPreview);
  return (
    <>
      <AdminLayout>
        <MetaData title={"Upload Product Images"} />
        <div className="row wrapper">
          <div className="col-10 col-lg-8 mt-5 mt-lg-0">
            <form
              className="shadow rounded bg-body"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <h2 className="mb-4">Upload Product Images</h2>

              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">
                  Choose Images
                </label>

                <div className="custom-file">
                  <input
                    ref={imgRef}
                    type="file"
                    name="product_images"
                    className="form-control"
                    id="customFile"
                    multiple
                    onChange={handleOnchange}
                    onClick={handleResetFile}
                  />
                </div>

                {imagesPreview?.length > 0 && (
                  <div className="new-images my-4">
                    <p className="text-warning">New Images:</p>
                    <div className="row mt-4">
                      {imagesPreview?.map((img, index) => (
                        <div className="col-md-3 mt-2" key={index + 1}>
                          <div className="card">
                            <img
                              src={img}
                              alt="Card"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px" }}
                            />
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#dc3545",
                              }}
                              type="button"
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              onClick={() => handleUploadedImageDelete(img)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {uploadImages?.length > 0 && (
                  <div className="uploaded-images my-4">
                    <p className="text-success">Product Uploaded Images:</p>
                    <div className="row mt-1">
                      {uploadImages?.map((img) => (
                        <div className="col-md-3 mt-2" key={img.public_id}>
                          <div className="card">
                            <img
                              src={img?.url}
                              alt="Card"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px" }}
                            />
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#dc3545",
                              }}
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              disabled="true"
                              type="button"
                              disabled={isLoading || isDeleteLoading}
                              onClick={() => deleteImage(img?.public_id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading || isDeleteLoading}
              >
                {isLoading ? "uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UploadImages;
