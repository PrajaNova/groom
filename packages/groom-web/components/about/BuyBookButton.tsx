"use client";

const BuyBookButton = () => {
  const onClick = () => {
    window.open(
      "https://wa.me/919999999999?text=I%20would%20like%20to%20buy%20the%20book%20'Finding%20Your%20Ground'%20by%20Satwikk%20Arora.",
      "_blank",
    );
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onClick}
        type="button"
        className="flex-1 bg-[#006442] text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:bg-[#004d32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006442]"
      >
        Buy From WhatsApp
      </button>
    </div>
  );
};

export default BuyBookButton;
