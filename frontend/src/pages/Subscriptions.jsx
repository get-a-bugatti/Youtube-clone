import axios from "axios";
import { handleAxiosError } from "../api/handleAxiosError.js";
import { useLoaderData } from "react-router-dom";
import SubscriptionCard from "../components/SubscriptionCard";

export async function SubscriptionsLoader() {
  try {
    const response = await axios.get("/api/v1/users/me/subscriptions");

    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
  }
}


export default function Subscriptions() {
  const subscriptions = useLoaderData();

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription._id}
          channel={subscription}
        />
      ))}
    </div>
  );
}