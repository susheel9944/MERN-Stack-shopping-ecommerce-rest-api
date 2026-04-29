import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import AdminLayout from "../layout/AdminLayout";

import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/userApi";

const ListUser = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetAdminUsersQuery();

  const [
    deleteUser,
    { error: deleteError, isLoading: isDeleteingLoading, isSuccess },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const deleteHandler = (id) => {
    deleteUser(id);
  };

  if (isLoading) return <Loader />;
  console.log("List Order++++++++", data);
  return (
    <>
      <AdminLayout>
        <MetaData title={"Product List"} />
        <div>
          <h1 className="my-5">{data?.orders?.length} Orders</h1>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((item) => (
                  <tr key={item._id}>
                    {console.log("user++++", item)}
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item?.email}</td>
                    <td>{item?.role}</td>
                    {console.log("checking update id", item._id)}
                    <td>
                      <Link
                        to={`/admin/update/users/${item?._id}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger ms-2"
                        onClick={() => deleteHandler(item?._id)}
                        disabled={isDeleteingLoading}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ListUser;
