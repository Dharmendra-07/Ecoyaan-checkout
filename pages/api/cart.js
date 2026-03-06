export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cartData = {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "/images/Bamboo-Toothbrush.jpg",
        description: "Biodegradable bamboo handle, BPA-free bristles",
        badge: "Bestseller",
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "/images/Reusable-Cotton-Produce-Bags.jpg",
        description: "Set of 5 organic cotton mesh bags",
        badge: "Eco Choice",
      },
    ],
    shipping_fee: 50,
    discount_applied: 0,
  };

  res.status(200).json(cartData);
}
