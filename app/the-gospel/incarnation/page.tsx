import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Incarnation - Abolish Abortion Michigan',
  description: 'The Word became flesh and dwelt among us. The Son of God appeared to destroy the works of the devil.',
};

export default function IncarnationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">INCARNATION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Word Became Flesh and Dwelt among us</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">The Son of God</span>{' '}
              <span className="font-black">APPEARED</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">To Destroy the Works of the Devil</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <div className="my-8 aspect-video">
              <iframe
                src="https://www.youtube.com/embed/4tL4Whq9NN0"
                title="The Incarnation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>

            <p>
              Jesus Christ, the Son of God, entered the womb to redeem the world, to forgive sinners, reconcile humanity to God, and make all things new.
            </p>

            <div className="flex flex-col md:flex-row gap-8 my-8 items-start">
              <div className="md:w-2/3 space-y-6">
                <p className="mt-0">
                  Jesus Christ, the only begotten Son of God, did not enter our world through a birth canal. He did not begin his earthly existence in a manger in Bethlehem. He began his human life in the womb of a young, unmarried woman who was not planning to be with child.
                </p>

                <p>
                  The Creator of the cosmos came down among us and began His earthly existence as a human zygote no larger than a single cell. The Light of the world entered the darkness of the womb and underwent every stage of prenatal biological development before being born into a hostile world that immediately sought His destructions.
                </p>

                <p>
                  He became like us in all things in order that He might live just as we lived and face the same dangers, temptations, and troubles we face as fleshly creatures living in a fallen world (Heb. 2:14-18; Col. 1:15-23).
                </p>
              </div>
              <div className="md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/incarnation-painting.jpeg"
                  alt="The Incarnation"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <p>
              The Son of God appeared to give light to those who sit in darkness, bring life and immortality to light through the Gospel, set people free from their slavery to sin, reconcile the world to Himself, abolish death, destroy every work of darkness, and guide our feet into the way of peace. He revealed Himself as the Word of the Father, Ruler and King of all creation, head of the church and the living God, and Redeemer of sinful men (Luke 1:78-79; 2 Tim. 1:10; Heb. 8:12; Luke 4:18; 1 Cor. 15:26; 2 Cor. 5:18-21; 1 John 3:8; Rom. 3:23-24).
            </p>

            <p>
              The Incarnation of Christ stands in direct conflict with all forms of child sacrifice. Modern forms include chemical and surgical abortion, the use of abortifacient drugs and devices designed to make the womb inhospitable for human embryos, and all destructive methods associated with the dehumanizing practice of producing children outside the womb (IVF). Christ continues His work today as He leads His people to actively bring the Gospel of His Kingdom into conflict with the practice of human abortion.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Abortion and the Incarnation of Christ</h3>

            <div className="my-8 aspect-video">
              <iframe
                src="https://www.youtube.com/embed/W9s9DgyLA28"
                title="Abortion and the Incarnation of Christ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>

            <p className="text-sm text-gray-400 italic">
              This content was originally published at Abolish Human Abortion. Abolish Abortion Michigan is not formally affiliated with Abolish Human Abortion, but shares its abolitionist principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/answer-to-abortion" className="text-red-600 font-semibold hover:underline">
              &larr; The Answer to Abortion
            </Link>
            <Link href="/the-gospel" className="text-red-600 font-semibold hover:underline">
              Back to The Gospel &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
