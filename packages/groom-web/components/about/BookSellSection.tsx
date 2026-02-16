import type React from "react";
import AppImage from "../AppImage";
import BuyBookButton from "./BuyBookButton";

const BookSellSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#D0D6C9] to-[#B48B7F]/20 p-10 rounded-2xl shadow-xl mb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-[#2C3531] mb-4">
            Transform Your Mental Health Journey
          </h3>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            This book offers a profound exploration of the complexities of
            heartbreak, delving deep into the emotional and psychological stages
            one experiences during such a turbulent time.
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
                  alt="Mental Health Guide by Satwikk Arora"
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
                "Finding Your Ground: A Personal Journey to Mental Wellness"
              </h4>
              <p className="text-lg text-[#006442] font-semibold">
                by Satwikk Arora
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The journey begins with the rawness of heartbreak, addressing
                the shock, denial, and grief that follow. It progresses through
                the recognition of mental health challenges that often accompany
                this period, such as anxiety, depression, and feelings of
                isolation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The book also sheds light on the dynamics and transactions
                within relationships—both the emotional investments and the
                often-overlooked imbalances that can shape the bond.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ultimately, the book serves as a gentle guide for readers to
                rediscover their strength, rebuild their identity, and embrace
                the possibility of growth and renewal after heartbreak. It is a
                heartfelt companion for anyone seeking solace, understanding,
                and hope during their healing journey.
              </p>
            </div>

            <div className="bg-white/50 p-6 rounded-lg border-l-4 border-[#006442]">
              <p className="text-gray-700 italic">
                "This book isn't about quick fixes or one-size-fits-all
                solutions. It's about helping you discover the unique path to
                your own mental wellness, at your own pace, with compassion and
                understanding."
              </p>
              <p className="text-sm text-[#006442] font-semibold mt-2">
                - Satwikk Arora
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
