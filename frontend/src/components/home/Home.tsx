import SlideContent from '../slide-content/SlideContent';
import './Home.css';

const slides = [
  {
    title: 'Buy Widgets',
    content: 'Buy our widgets at the best prices',
    imageUrl: '/analyst.jpeg',
    path: '/services/bookkeeping',
  },
  {
    title: 'Widget Manufacturing',
    content: 'Efficient and cost-effective widget production',
    imageUrl: '/tax.jpeg',
    path: '/services/tax',
  },
  {
    title: 'Widget Partnerships',
    content: 'Partner with us and sell widgets together',
    imageUrl: '/calculator.jpeg',
    path: '/services/advisory',
  },
];

const Home = () => {
  return (
    <div>
      <h1 className="h1">Company Widgets</h1>
      <p className="mt-4 text-xl text-gray-600">
        Company Widgets is a wholesaler of widgets. We provide the best quality
        widgets at the most competitive prices. Our team of experts is here to
        help you with all your widget needs.
      </p>

      <SlideContent slides={slides} />
    </div>
  );
};

export default Home;
