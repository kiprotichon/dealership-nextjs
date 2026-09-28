export default function ContactPage() {
  return (
    <main className="py-16 px-[5%] max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Have a question about a vehicle, financing, or trade-in? Reach out and our team will get back to you.
      </p>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Phone:</strong> +254 715 455 098</li>
        <li><strong>Email:</strong> dailybazaarltd@gmail.com</li>
        <li><strong>P.O Box:</strong> 180101-00100, Nairobi</li>
      </ul>
      <a
        href="https://wa.me/254715455098"
        target="_blank"
        rel="noreferrer"
        className="btn inline-block mt-6"
      >
        Message us on WhatsApp
      </a>
    </main>
  );
}
