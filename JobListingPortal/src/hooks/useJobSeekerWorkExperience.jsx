import { useCallback, useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";
import toast from "react-hot-toast";

export const useJobSeekerWorkExperience = () => {
  const { auth } = useAuth();
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkExperience = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://lysterpro-backend.onrender.com/api/v1/jobseeker/get-experience-detail`,
        {
          headers: auth ? { Authorization: `Bearer ${auth}` } : {},
        }
      );

      if (response.data.status === "success") {
        setWorkExperience(response.data.data.experienceDetails);
      } else {
        throw new Error("Failed to fetch work experience");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch work experience"
      );
      console.error("Failed to fetch work experience", err);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const deleteWorkExperience = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.delete(
          `https://lysterpro-backend.onrender.com/api/v1/jobseeker/delete-experience-detail/${id}`,
          {
            headers: auth ? { Authorization: `Bearer ${auth}` } : {},
          }
        );
        console.log(response);
        if (response.status === 204) {
          toast.success("Work experience deleted successfully");
          fetchWorkExperience();
        } else {
          throw new Error("Failed to delete work experience");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete work experience"
        );
        console.error("Failed to delete work experience", err);
      } finally {
        setLoading(false);
      }
    },
    [auth, fetchWorkExperience]
  );

  useEffect(() => {
    fetchWorkExperience();
  }, [fetchWorkExperience]);

  return {
    workExperience,
    loading,
    error,
    refetch: fetchWorkExperience,
    deleteWorkExperience,
  };
};
