import { ratingService } from "../services/rating.service";
import { toast } from "sonner";
import { create } from "zustand";
export const useRatingStore = create((set, get) => ({
  validateRating: ({ reviewContent, rateType }) => {
    if (!reviewContent) return `Review content must not be blank.`;
    if (!rateType) return `Please select uprate or downrate to this seller.`;
    if (reviewContent.length > 200)
      return `Review content must not exceed 200 characters.`;
    if (rateType != "uprate" && rateType != "downrate") {
      return `Your rate type is invalid.`;
    }
    return null;
  },
  handleSubmitRating: async ({
    ratedUserId,
    auctionId,
    reviewContent,
    rateType,
  }) => {
    const toastId = toast.loading("Submitting rating....");
    try {
      const res = await ratingService.submitRating({
        ratedUserId,
        auctionId,
        reviewContent,
        rateType,
      });
      toast.success("Submit successfully.", { id: toastId });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
}));
