export default function ContactPage() {
  return (
    <main className="py-16 px-[5%] max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Have a question about a vehicle, financing, or trade-in? Reach out and our team will get back to you.
      </p>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Phone:</strong> +254 700 000 000</li>
        <li><strong>Email:</strong> info@premiermotors.co.ke</li>
        <li><strong>Location:</strong> Nairobi, Kenya</li>
      </ul>
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noreferrer"
        className="btn inline-block mt-6"
      >
        Message us on WhatsApp
      </a>
    </main>
  );
}
