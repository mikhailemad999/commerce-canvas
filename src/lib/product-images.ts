import headphones from "@/assets/products/headphones.jpg";
import tv from "@/assets/products/tv.jpg";
import messengerBag from "@/assets/products/messenger-bag.jpg";
import smartHub from "@/assets/products/smart-hub.jpg";
import knifeSet from "@/assets/products/knife-set.jpg";
import skincare from "@/assets/products/skincare.jpg";
import roadBike from "@/assets/products/road-bike.jpg";
import books from "@/assets/products/books.jpg";
import keyboard from "@/assets/products/keyboard.jpg";
import overcoat from "@/assets/products/overcoat.jpg";
import espresso from "@/assets/products/espresso.jpg";
import drone from "@/assets/products/drone.jpg";

// Map product IDs to their local image imports
export const productImages: Record<string, string> = {
  "814f315a-41e5-4055-8c39-e09f6eb13ffb": headphones,
  "5a6ff315-14ce-4167-85bf-f160573192f0": tv,
  "0fbf1d16-ee25-4149-b6a6-c9c76dc088b7": messengerBag,
  "52285e2d-112e-4276-be53-aaeb6cfbdf21": smartHub,
  "8abefd49-6ed0-4e02-91cf-c8048a8067e5": knifeSet,
  "e7087027-d899-454c-aa6b-31054c716756": skincare,
  "2a9f6b76-556d-48b4-b52c-6d4d2a78d161": roadBike,
  "c5b63d8b-d346-4a18-b19f-729ff51ce681": books,
  "d6230cea-b203-4138-a167-defb67cd18c8": keyboard,
  "bd2950f6-f0a1-4575-ae35-a0bbdcf7a8fe": overcoat,
  "ca8e9cb1-9183-4a78-8793-fb998575e19c": espresso,
  "91829511-e3b8-42ac-885c-b8417f7ff58d": drone,
};

export function getProductImage(productId: string, fallback: string = "/placeholder.svg"): string {
  return productImages[productId] ?? fallback;
}
