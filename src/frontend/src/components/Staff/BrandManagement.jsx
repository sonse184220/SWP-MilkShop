import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleAllBrand } from "../../services/brand/getAllBrand";
import { AddBrand } from "../../services/staff/brand/addBrand";
import { UpdateBrand } from "../../services/staff/brand/updateBrand";
import { DeleteBrand } from "../../services/staff/brand/deleteBrand";
import "./BrandManagement.css";

function BrandManagement() {
  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  const [brands, setBrands] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState({
    Name: "",
    Content: "",
  });

  const handleGetAllBrand = async () => {
    try {
      const response = await handleAllBrand();
      if (response.data.length > 0) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleAddBrand = async () => {
    try {
      // Clean up the content to remove HTML tags
      const cleanContent = selectedBrand.Content.replace(/<\/?[^>]+(>|$)/g, "");

      const brandData = {
        brandName: selectedBrand.Name,
        content: cleanContent,
      };

      console.log("Selected Brand Data:", brandData);

      const response = await AddBrand(StaffToken, brandData);
      console.log(response);
      if (response.data.message) {
        toast.success("Brand added successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
      handleGetAllBrand();
      setIsAddModalOpen(false);
      setSelectedBrand({
        Name: "",
        Content: "",
      });
    } catch (error) {
      console.error("Error Response:", error.response.data);
      toast.error("Failed to add brand. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!selectedBrand.BrandID) {
      console.error("BrandID is required");
      return;
    }

    try {
      const brandData = {
        Name: selectedBrand.brandName,
        Content: selectedBrand.content,
      };

      const response = await UpdateBrand(
        StaffToken,
        selectedBrand.BrandID,
        brandData
      );

      if (response.data && response.data.message) {
        toast.success("Brand updated successfully", {
          duration: 3000,
          position: "top-right",
        });
      }

      handleGetAllBrand();
      setIsUpdateModalOpen(false);
      setSelectedBrand({
        brandName: "",
        content: "",
      });
    } catch (error) {
      console.error("Update Brand Error:", error);
      toast.error("Failed to update brand. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
      setIsUpdateModalOpen(false);
    }
  };

  const handleDeleteBrand = async (brandID) => {
    try {
      const response = await DeleteBrand(StaffToken, brandID);
      if (response.data.message) {
        handleGetAllBrand();
        toast.success("Brand deleted successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Failed to delete brand. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
    handleGetAllBrand();
  };

  useEffect(() => {
    handleGetAllBrand();
  }, []);

  return (
    <>
      <h2 style={{ marginTop: "10px" }}>Brands</h2>
      <button
        className="addBrand"
        onClick={() => {
          setSelectedBrand({
            Name: "",
            Content: "",
          });
          setIsAddModalOpen(true);
        }}
      >
        Add Brand
      </button>
      <table className="issues-table">
        <thead>
          <tr>
            <th>BrandID</th>
            <th>Brand Name</th>
            <th>Content</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.BrandID}>
              <td>{brand.BrandID}</td>
              <td>{brand.Name}</td>
              <td>{brand.Content}</td>
              <td className="deleteDiv">
                <div className="delete">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBrand(brand.BrandID)}
                  >
                    <a href="#">Delete</a>
                  </button>
                </div>
              </td>
              <td className="updateDiv">
                <div className="delete">
                  <button
                    className="delete-button"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Brand Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="custom-modal-brand"
        overlayClassName="custom-overlay-brand"
      >
        <h2>Add Brand</h2>
        <label htmlFor="brandName">Brand Name: </label>
        <input
          id="brandName"
          value={selectedBrand.Name}
          onChange={(e) =>
            setSelectedBrand({ ...selectedBrand, Name: e.target.value })
          }
        />
        <label htmlFor="brandContent">Content: </label>
        <ReactQuill
          theme="snow"
          value={selectedBrand.Content}
          onChange={(content) =>
            setSelectedBrand({ ...selectedBrand, Content: content })
          }
        />
        <div className="modal-actions-brand">
          <button onClick={handleAddBrand} className="btn-confirm-brand">
            Confirm
          </button>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="btn-cancel-brand"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Update Brand Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        className="custom-modal-brand"
        overlayClassName="custom-overlay-brand"
      >
        <h2>Update Brand</h2>
        <label htmlFor="brandName">Brand Name: </label>
        <input
          id="brandName"
          value={selectedBrand.Name}
          onChange={(e) =>
            setSelectedBrand({ ...selectedBrand, Name: e.target.value })
          }
        />
        <label htmlFor="brandContent">Content: </label>
        <ReactQuill
          theme="snow"
          value={selectedBrand.Content}
          onChange={(content) =>
            setSelectedBrand({ ...selectedBrand, Content: content })
          }
        />
        <div className="modal-actions-brand">
          <button onClick={handleUpdateBrand} className="btn-confirm-brand">
            Confirm
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="btn-cancel-brand"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

export default BrandManagement;
