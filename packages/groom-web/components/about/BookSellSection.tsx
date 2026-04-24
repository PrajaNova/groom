import type React from "react";
import AppImage from "../AppImage";
import BuyBookButton from "./BuyBookButton";
import { bookSellContent } from "##/content/about/book-sell";

const BookSellSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#D0D6C9] to-[#B48B7F]/20 p-10 rounded-2xl shadow-xl mb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-[#2C3531] mb-4">
            {bookSellContent.title}
          </h3>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {bookSellContent.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Book Image */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#006442] to-[#8C2D3A] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                <AppImage
                  src="/images/book_cover.png"
                  alt={`Mental Health Guide by ${bookSellContent.author}`}
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-2xl font-bold text-[#2C3531] mb-2">
                {bookSellContent.bookTitle}
              </h4>
              <p className="text-lg text-[#006442] font-semibold">
                {bookSellContent.author}
              </p>
            </div>

            <div className="space-y-4">
              {bookSellContent.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="bg-white/50 p-6 rounded-lg border-l-4 border-[#006442]">
              <p className="text-gray-700 italic">
                "{bookSellContent.quote}"
              </p>
              <p className="text-sm text-[#006442] font-semibold mt-2">
                {bookSellContent.quoteAuthor}
              </p>
            </div>

            <BuyBookButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSellSection;
