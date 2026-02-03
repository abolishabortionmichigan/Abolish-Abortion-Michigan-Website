import { Metadata } from 'next';
import GalleryImage from '@/components/GalleryImage';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Media - Abolish Abortion Michigan',
  description: 'Photos, videos, and resources from Abolish Abortion Michigan events and activism.',
};

// Placeholder gallery data - replace with actual images
const galleryImages = [
  { id: 1, src: '/images/gallery-1.jpg', alt: 'Event photo 1' },
  { id: 2, src: '/images/gallery-2.jpg', alt: 'Event photo 2' },
  { id: 3, src: '/images/gallery-3.jpg', alt: 'Event photo 3' },
  { id: 4, src: '/images/gallery-4.jpg', alt: 'Event photo 4' },
  { id: 5, src: '/images/gallery-5.jpg', alt: 'Event photo 5' },
  { id: 6, src: '/images/gallery-6.jpg', alt: 'Event photo 6' },
];

export default function MediaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MEDIA</h1>
          <p className="text-gray-400">Photos, videos, and resources</p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="photos" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Photo Gallery</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <GalleryImage key={image.id} src={image.src} alt={image.alt} />
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            More photos coming soon. Check back for updates from our events and outreach activities.
          </p>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Videos</h2>

          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">
              Video content coming soon. Subscribe to our social media channels for the latest updates.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://facebook.com/abolishabortionmichigan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/abolishabortionmi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Resources</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Church Resources</h3>
              <p className="text-gray-700 mb-4">
                Materials to help your church speak out for the preborn, including sermon outlines and bulletin inserts.
              </p>
              <span className="text-gray-400">Coming Soon</span>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Printable Materials</h3>
              <p className="text-gray-700 mb-4">
                Flyers, brochures, and signs for outreach and awareness events.
              </p>
              <span className="text-gray-400">Coming Soon</span>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Social Media Graphics</h3>
              <p className="text-gray-700 mb-4">
                Share-ready images and graphics for your social media platforms.
              </p>
              <span className="text-gray-400">Coming Soon</span>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Educational Materials</h3>
              <p className="text-gray-700 mb-4">
                Information about abortion, abolition, and how to engage in conversations on these topics.
              </p>
              <span className="text-gray-400">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
