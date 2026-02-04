import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Biblical, Not Secular - Abolish Abortion Michigan',
  description: 'Our opposition to abortion is grounded in biblical principles, not secular arguments. The duty is ours, the results belong to God.',
};

export default function BiblicalNotSecularPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">BIBLICAL, NOT SECULAR</h1>
          <p className="text-xl text-gray-300">THE DUTY IS OURS | THE RESULTS BELONG TO GOD</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">We Are Biblical</h2>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>God has chosen the foolish things of the world to shame the wise</p>
              <cite className="text-gray-600 not-italic">&mdash; 1 Cor. 1:27</cite>
            </blockquote>

            <p>
              To be an abolitionist is more than simply working to end something. Anyone can work to end something. Abolitionism is about bringing the truth revealed in God&apos;s word into conflict with the evils of the age and the worldly wisdom of man. While the pro-life movement will argue that abortion is wrong because it causes pain, stops a beating heart, or betrays women, abolitionists maintain that abortion is wrong because human beings are created in the image of God and because the Creator Himself became a man in order to rescue mankind from sin, death, and eternal separation from God.
            </p>

            <p>
              Successful human rights campaigns throughout history have been built on this foundation. Perhaps the best articulation of what it means to bring the Gospel into conflict with the evil of the age comes from slavery abolitionist William Lloyd Garrison when he said, &ldquo;My fanaticism is to make Christianity the enemy of all that is sinful.&rdquo;
            </p>

            <p>
              Being Biblical means relying on God&apos;s words rather than worldly tactics and strategies. Rather than playing a game of political football, we proclaim God&apos;s word to the people and to the magistrates. That means we don&apos;t do things like test the winds to see whether the people support moving from a ban of abortion at 28 weeks to a ban at 24 weeks at this particular moment in time. We simply proclaim the truth that abortion is murder and that justice demands it be abolished immediately. The duty to make such proclamations is ours, and the results belong to God.
            </p>

            <p>
              This duty, as all moral obligations, is grounded in God&apos;s revealed word. Proverbs 24 tells us to rescue those being led to slaughter and in Isaiah 10, God warns the Hebrew leaders, &ldquo;Woe to those who decree iniquitous decrees.&rdquo; As for how to rescue those lead to slaughter, pro-life incrementalists are content to compromise in an attempt to save some babies, but these compromises are the definition of iniquitous decrees. They all allow for abortion as long as the baby is young enough. Romans 3:8 rebukes those who would do evil that good may come, which is literally the strategy of the pro-life establishment. As abolitionists who take God&apos;s word seriously, we never write laws which make the fatherless prey and there&apos;s no one more fatherless than the child conceived in rape. The pro-life movement has long been content to write laws allowing for the murder of the most fatherless among us because of the crimes of their fathers. Woe unto them for this great and wicked compromise (Isaiah 10:1-2).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Moses, The First Abolitionist</h3>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/moses-pharaoh.jpg"
              alt="Moses and Pharaoh dialogue"
              className="w-full my-8 rounded-lg"
            />

            <p>
              Moses was a prototypical abolitionist. With his people suffering under a tyrant, Pharaoh offered all sorts of deals to Moses. He offered to let some of the Hebrews go, he offered to let the Hebrews go for a certain amount of time, and he even offered to let all the Hebrews go free permanently so long as they left their animals &ndash; to which Moses replied, &ldquo;Not a hoof shall be left behind&rdquo; (Exodus 10:24-26).
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Where They Conflict, Obey God Rather Than Man</h3>
              <p>
                Among many other verses, Acts 5:29 teaches us that when presented with the choice between obeying God or obeying man, we obey God. So when the supreme court orders our state to allow the mass murder of preborn children, we boldly bring the Gospel into conflict with the court&apos;s rebellion against God.
              </p>
            </div>

            <p>
              Being Biblical means that abolition is the duty of the Church. While the pro-life leaders would have you do little or nothing more than send them a check in the mail every month, we exhort you to actively bring the Gospel into conflict with the practice of child sacrifice. Go to your local killing center and preach the Gospel to those stumbling toward slaughter. Schedule a meeting with your state senators, state representatives, state executives, city councils, and any other magistrates to explain to them their duty before God and Constitution to immediately abolish abortion. Spiritually and materially aid the pregnant single mothers in your neighborhood or church. Share abolitionist ideas with your friends and family. Share abolitionist articles, memes, and videos on social media. And encourage your fellow brothers and sisters in Christ to join you in all of that. That doesn&apos;t mean there aren&apos;t worthy abolitionist projects that need financial support from Christians. There are. But the Christian duty doesn&apos;t end there.
            </p>

            <p>
              Click the button below to read about the second distinction between abolitionists and pro-lifers: Abolitionists are immediatists while pro-lifers are incrementalists.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/immediate-not-gradual"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; WE ARE IMMEDIATISTS
              </Link>
            </div>

            <p className="text-sm text-gray-400 italic">
              This content was originally published by Free the States, and is used by permission. Abolish Abortion Michigan is not formally affiliated with Free the States, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/abolitionist-not-pro-life" className="text-red-600 font-semibold hover:underline">
              &larr; Abolitionist, Not Pro-Life
            </Link>
            <Link href="/what-we-believe/immediate-not-gradual" className="text-red-600 font-semibold hover:underline">
              Immediate, Not Gradual &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
