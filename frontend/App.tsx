import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  ChevronDown,
  ClipboardList,
  Filter,
  LayoutDashboard,
  Leaf,
  MapPin,
  Navigation,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { productService } from "./services/productService";
import type { Product, ProductCategory } from "./mock/products";
import { products } from "./mock/products";
import { DashboardPortal } from "./features/portal/DashboardPortal";
import { authService } from "./services/authService";
import type { UserRole } from "./types/api";
import type { Session } from "./services/authService";
import { FarmerDashboard } from "./features/farmer-dashboard";
import { OrderTrackingPanel } from "./features/order-tracking";
import { FarmerInventory } from "./features/farmer-inventory";
import { BuyerFavorites, FavoriteButton } from "./features/buyer-favorites";
import { FeatureHub, MarketInsights } from "./features/market-insights";
import { insightFeatures } from "./features/market-insights/service";
import { NotificationCenter } from "./features/notifications";
import { WorkflowWorkspace } from "./features/workflow-suite";
import {
  ComparisonPage,
  CompareButton,
  CouponField,
  RecentlyViewed,
  RecentlyViewedRecorder,
  ShoppingAssistant,
} from "./features/commerce-tools";
import { ProductReviewPanel, ReviewsPage } from "./features/product-reviews";
import { CropAdvisor } from "./features/ai-crop-advisor";
import { ProfileAccount } from "./features/profile-account";
import { FeatureDirectory } from "./features/feature-directory";
import { Impact as ImpactPage } from "./components/Impact";
import { getApiLoadingSnapshot, subscribeToApiLoading } from "./services/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

type CartItem = { product: Product; quantity: number };
const categories: Array<"All" | ProductCategory> = [
  "All",
  "Vegetables",
  "Grains",
  "Fruits",
  "Spices",
  "Cash crops",
];
const cartStorageKey = "direct-market-cart";

function getStoredCart(): CartItem[] {
  try {
    return JSON.parse(
      localStorage.getItem(cartStorageKey) ?? "[]",
    ) as CartItem[];
  } catch {
    return [];
  }
}

function addToStoredCart(product: Product) {
  const cart = getStoredCart();
  const existing = cart.find((item) => item.product.id === product.id);
  const next = existing
    ? cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    )
    : [...cart, { product, quantity: 1 }];
  localStorage.setItem(cartStorageKey, JSON.stringify(next));
  localStorage.setItem(
    "direct-market-cart-count",
    String(next.reduce((sum, item) => sum + item.quantity, 0)),
  );
}

function PersistentCart() {
  const [items, setItems] = useState<CartItem[]>(getStoredCart);
  const change = (id: string, amount: number) => {
    setItems((current) => {
      const next = current
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem(cartStorageKey, JSON.stringify(next));
      localStorage.setItem(
        "direct-market-cart-count",
        String(next.reduce((sum, item) => sum + item.quantity, 0)),
      );
      return next;
    });
  };

  return (
    <>
      <div className="cart-tools">
        <CouponField />
      </div>
      <Cart items={items} change={change} />
    </>
  );
}

function EnhancedDetail({ add }: { add: (product: Product) => void }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  return (
    <>
      <RecentlyViewedRecorder productId={id ?? ""} />
      <Detail add={add} />
      <ProductReviewPanel product={product ?? products[0]} />
      <RecentlyViewed excludeId={id} />
    </>
  );
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(
    () =>
      JSON.parse(
        localStorage.getItem("direct-market-cart") ?? "[]",
      ) as CartItem[],
  );
  useEffect(() => {
    localStorage.setItem("direct-market-cart", JSON.stringify(cart));
  }, [cart]);
  const add = (product: Product) =>
    setCart((current) => {
      const item = current.find((entry) => entry.product.id === product.id);
      return item
        ? current.map((entry) =>
          entry.product.id === product.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        )
        : [...current, { product, quantity: 1 }];
    });
  const change = (id: string, amount: number) =>
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const links = [
    { label: "Home", to: "/" },
    { label: "Marketplace", to: "/marketplace" },
    { label: "How it works", to: "/#how" },
    { label: "Farmers", to: "/register" },
    { label: "Logistics", to: "/logistics" },
    { label: "Impact", to: "/impact" },
  ];
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="wordmark" to="/">
          <span className="mark">
            <Leaf size={18} />
          </span>
          <span>KisanBazaar</span>
        </Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="nav-sell">
            Start selling <ArrowRight size={15} />
          </Link>
        </nav>
        <div className="top-actions">
          <button
            className="menu-button"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <NotificationCenter />
          <button
            className="icon-button"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && <em>{cart.reduce((sum, item) => sum + item.quantity, 0)}</em>}
          </button>
          <button className="avatar">AK</button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home add={add} />} />
          <Route path="/marketplace" element={<Marketplace add={add} />} />
          <Route path="/marketplace/:id" element={<Detail add={add} />} />{" "}
          <Route path="/cart" element={<Cart items={cart} change={change} />} />{" "}
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />{" "}
          <Route path="/ai-crop-advisor" element={<CropAdvisor />} />
          <Route path="/directory" element={<FeatureDirectory />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/features" element={<FeatureHub />} />
          <Route path="/features/:kind" element={<MarketInsights />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>{" "}
      <nav className="bottom-nav">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          <Leaf size={19} />
          <span>Home</span>
        </Link>{" "}
        <Link
          className={location.pathname.includes("marketplace") ? "active" : ""}
          to="/marketplace"
        >
          <Package size={19} />
          <span>Products</span>
        </Link>
        <Link
          className={location.pathname.includes("favorites") ? "active" : ""}
          to="/buyer/favorites"
        >
          <Star size={19} />
          <span>Favourite</span>
        </Link>
        <Link
          className={location.pathname === "/impact" ? "active" : ""}
          to="/impact"
        >
          <Sparkles size={19} />
          <span>Impact</span>
        </Link>
      </nav>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

function LandingMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = root.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const context = gsap.context(() => {
      const sections = Array.from(
        scope.querySelectorAll<HTMLElement>(".landing-motion"),
      );
      sections.forEach((section, index) => {
        const direction = index % 3 === 1 ? -42 : index % 3 === 2 ? 42 : 0;
        const vertical = direction === 0 ? 34 : 14;
        gsap.fromTo(
          section,
          { autoAlpha: 0, x: direction, y: vertical },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 88%", once: true },
          },
        );
      });

      const staggerGroups = [
        ".market-price-list > span",
        ".category-grid > .category-tile",
        ".journey-grid > div",
        ".faq-list > details",
      ];
      staggerGroups.forEach((selector) => {
        const elements = Array.from(
          scope.querySelectorAll<HTMLElement>(selector),
        );
        elements.forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 24, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 92%",
                once: true,
              },
            },
          );
        });
      });

      gsap.fromTo(
        ".landing-search",
        { autoAlpha: 0, y: 18, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.18,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".landing-message",
            start: "top 88%",
            once: true,
          },
        },
      );
      const heroCopy =
        document.querySelector<HTMLElement>(".landing-hero-copy");
      const heroVisual = document.querySelector<HTMLElement>(".hero-orbit");
      if (heroCopy)
        gsap.fromTo(
          heroCopy,
          { autoAlpha: 0, x: -36 },
          { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
        );
      if (heroVisual)
        gsap.fromTo(
          heroVisual,
          { autoAlpha: 0, x: 36, scale: 0.96 },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 1,
            delay: 0.12,
            ease: "power3.out",
          },
        );
      gsap.to(".landing-parallax", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".spotlight-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, scope);
    return () => context.revert();
  }, []);
  return (
    <div ref={root} className="landing-enhancements">
      <section className="landing-motion landing-message">
        <p className="eyebrow">A BETTER WAY TO TRADE AGRICULTURE</p>
        <h2>
          The mandi, made more direct.
          <br />
          <i>Trade with confidence.</i>
        </h2>
        <p>
          Find reliable supply, connect with trusted farmers and traders, and
          move every order from source to buyer with clarity.
        </p>
        <form
          className="landing-search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("query");
            window.location.href = `/marketplace?search=${encodeURIComponent(String(query ?? ""))}`;
          }}
        >
          <Search size={17} />
          <input
            name="query"
            aria-label="Search product, category, or location"
            placeholder="Search produce, trader, or location"
          />
          <button type="submit">Search market</button>
        </form>
      </section>
      <section className="landing-motion landing-info-strip">
        <div>
          <ShieldCheck size={20} />
          <strong>Verified supply</strong>
          <span>
            Know the farmer, FPO, location, and quality before ordering.
          </span>
        </div>
        <div>
          <ShoppingBasket size={20} />
          <strong>Fairer pricing</strong>
          <span>
            See farmer price, packing, logistics, and platform costs separately.
          </span>
        </div>
        <div>
          <Truck size={20} />
          <strong>Reliable delivery</strong>
          <span>
            Plan quantities and follow your produce from source to destination.
          </span>
        </div>
      </section>
      <section className="landing-motion mandi-offers-section">
        <div className="landing-section-heading">
          <p className="eyebrow">BUILT FOR THE PEOPLE WHO MOVE FOOD</p>
          <h2>
            One market.
            <br />
            <i>Many ways to grow.</i>
          </h2>
          <p>
            Whether you grow, aggregate, trade, or buy in volume, Direct Market
            keeps the next deal simple.
          </p>
        </div>
        <div className="mandi-offers-grid">
          <article>
            <span className="offer-number">01</span>
            <h3>For farmers & FPOs</h3>
            <p>
              Show your available harvest, reach serious buyers, and build a
              dependable selling network.
            </p>
            <Link to="/register" className="text-button">
              Start selling <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <span className="offer-number">02</span>
            <h3>For traders & retailers</h3>
            <p>
              Compare quality, quantity, location, and source prices before you
              commit to a load.
            </p>
            <Link to="/marketplace" className="text-button">
              Find supply <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <span className="offer-number">03</span>
            <h3>For bulk buyers</h3>
            <p>
              Plan procurement, track shipments, and keep your team aligned from
              mandi to destination.
            </p>
            <Link to="/login" className="text-button">
              Open buyer tools <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>
      <section className="landing-motion market-live-section">
        <div>
          <p className="eyebrow">LIVE MARKET PULSE</p>
          <h2>
            Prices that move
            <br />
            <i>with the harvest.</i>
          </h2>
          <p>
            Track indicative source prices before you buy, list, or plan your
            next delivery.
          </p>
        </div>
        <div className="market-price-list">
          <span>
            <b>Tomatoes</b>
            <strong>₹28/kg</strong>
            <em>+8.4%</em>
          </span>
          <span>
            <b>Alphonso mangoes</b>
            <strong>₹145/kg</strong>
            <em>+5.1%</em>
          </span>
          <span>
            <b>Sona Masuri rice</b>
            <strong>₹68/kg</strong>
            <em>-2.3%</em>
          </span>
        </div>
      </section>
      <section className="landing-motion category-section">
        <div className="landing-section-heading">
          <p className="eyebrow">SHOP BY CATEGORY</p>
          <h2>
            Good food starts
            <br />
            <i>at the source.</i>
          </h2>
        </div>
        <div className="category-grid">
          {["Vegetables", "Fruits", "Grains", "Pulses", "Dairy", "Seeds"].map(
            (category, index) => (
              <Link
                to={`/marketplace?category=${encodeURIComponent(category)}`}
                className="category-tile"
                key={category}
              >
                <span>{["🥬", "🍊", "🌾", "🫘", "🥛", "🌱"][index]}</span>
                <b>{category}</b>
                <small>Verified sources</small>
              </Link>
            ),
          )}
        </div>
      </section>
      <section className="landing-motion spotlight-section">
        <div className="spotlight-image">
          <img
            className="landing-parallax"
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
            alt="Farmer holding fresh produce"
          />
        </div>
        <div>
          <p className="eyebrow">FARMER / FPO SPOTLIGHT</p>
          <h2>
            Meet the people
            <br />
            <i>behind your food.</i>
          </h2>
          <p>
            Sunita Devi and the Nashik Growers Collective supply consistent
            Grade A produce directly to buyers across India.
          </p>
          <div className="trust-row">
            <span>
              <ShieldCheck size={15} /> Verified grower
            </span>
            <span>
              <MapPin size={15} /> Nashik, Maharashtra
            </span>
          </div>
          <Link className="outline-button" to="/directory">
            Explore farmer directory <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section className="landing-motion ai-preview-section">
        <div>
          <p className="eyebrow">SMARTER DECISIONS</p>
          <h2>
            Know what to grow
            <br />
            <i>before the season.</i>
          </h2>
          <p>
            Our demand signals turn marketplace activity into practical
            recommendations for farmers and procurement teams.
          </p>
          <Link className="primary-button" to="/features/demand">
            Explore demand insights <ArrowRight size={15} />
          </Link>
        </div>
        <div className="forecast-card">
          <div>
            <span className="forecast-icon">
              <Sparkles size={17} />
            </span>
            <b>AI crop advisor</b>
            <small>Next 7 days</small>
          </div>
          <strong>
            Tomato demand <em>HIGH</em>
          </strong>
          <div className="forecast-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <p>
            Recommended supply <b>2,400 kg</b>
          </p>
        </div>
      </section>


      <section className="landing-motion journey-section">
        <div className="landing-section-heading">
          <p className="eyebrow">HOW DIRECT MARKET WORKS</p>
          <h2>
            From farmer
            <br />
            <i>to buyer.</i>
          </h2>
        </div>
        <div className="journey-grid">
          <div>
            <span>01</span>
            <Leaf size={20} />
            <h3>Farmer</h3>
            <p>List your harvest and set a fair source price.</p>
          </div>
          <ArrowRight size={22} />
          <div>
            <span>02</span>
            <ShoppingBasket size={20} />
            <h3>Marketplace</h3>
            <p>Compare verified supply and transparent costs.</p>
          </div>
          <ArrowRight size={22} />
          <div>
            <span>03</span>
            <Truck size={20} />
            <h3>Buyer</h3>
            <p>Track delivery and receive produce with confidence.</p>
          </div>
        </div>
      </section>
      <section className="landing-motion testimonial-section">
        <p className="eyebrow">TRUSTED BY THE NETWORK</p>
        <blockquote>
          “Direct Market gives our buyers clarity and gives our growers a fairer
          share of every order.”
        </blockquote>
        <span>— Meera Shah, Green Basket Co.</span>
      </section>
      <section className="landing-motion faq-section">
        <div className="landing-section-heading">
          <p className="eyebrow">QUESTIONS, ANSWERED</p>
          <h2>
            Start with
            <br />
            <i>confidence.</i>
          </h2>
        </div>
        <div className="faq-list">
          <details open>
            <summary>How are prices calculated?</summary>
            <p>
              Each listing separates the farmer price, collection, packing,
              transport, and platform costs.
            </p>
          </details>
          <details>
            <summary>Can I buy in bulk?</summary>
            <p>
              Yes. Bulk buyers can compare available quantities and connect with
              verified growers.
            </p>
          </details>
          <details>
            <summary>Are farmers verified?</summary>
            <p>
              Listings are linked to verified farmer or FPO profiles with origin
              and quality details.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

function Home({
  add,
  session = null,
}: {
  add: (product: Product) => void;
  session?: Session | null;
}) {
  const [activeCategory, setActiveCategory] = useState("Vegetables");
  const [notice, setNotice] = useState("");
  const featured = {
    id: "tomato-01",
    name: "Fresh Tomatoes",
    category: "Vegetables" as ProductCategory,
    farmer: "Sunita Devi",
    location: "Nashik, Maharashtra",
    price: 28,
    unit: "kg",
    quantity: 2400,
    quality: "Grade A",
    organic: false,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
    harvest: "Today",
    accent: "#e46c48",
  };
  const catalog = [
    featured,
    {
      id: "onion-01",
      name: "Red Onion",
      category: "Vegetables" as ProductCategory,
      farmer: "Sunita Devi",
      location: "Nashik, Maharashtra",
      price: 22,
      unit: "kg",
      quantity: 8500,
      quality: "Grade A",
      organic: false,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80",
      harvest: "Today",
      accent: "#a85460",
    },
    {
      id: "potato-01",
      name: "Potato Jyoti",
      category: "Vegetables" as ProductCategory,
      farmer: "Rajesh Patel",
      location: "Anand, Gujarat",
      price: 18,
      unit: "kg",
      quantity: 12000,
      quality: "Grade B",
      organic: false,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
      harvest: "Today",
      accent: "#bd8b61",
    },
    {
      id: "rice-01",
      name: "Sona Masuri Rice",
      category: "Grains" as ProductCategory,
      farmer: "Krishna FPO",
      location: "Mandya, Karnataka",
      price: 68,
      unit: "kg",
      quantity: 1800,
      quality: "Premium",
      organic: true,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
      harvest: "Today",
      accent: "#d8b779",
    },
  ];
  const addFeatured = (product: Product) => {
    add(product);
    setNotice(`${product.name} added to your basket`);
    window.setTimeout(() => setNotice(""), 2200);
  };
  return (
    <div className="landing-page">

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <h1>
            From Your Farm.
            <br />
            <b>Direct to Their Door.</b>
          </h1>
          <p>
            Better prices for farmers. Better value for buyers. One practical
            marketplace for fresh produce, trusted supply, and dependable
            delivery.
          </p>
          <div className="hero-buttons">
            <Link to="/marketplace" className="primary-button warm">
              Browse marketplace <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="light-link">
              Start selling <ArrowRight size={16} />
            </Link>
          </div>
          {!session && (
            <div className="guest-hero-callout">
              <strong>New to Direct Market?</strong>
              <span>
                Create a free account to save products, track orders, and access
                your personalized dashboard.
              </span>
              <Link to="/register">
                Join the marketplace <ArrowRight size={14} />
              </Link>
            </div>
          )}
          <div className="hero-stats">
            <span>
              <b>2,840+</b>
              <small>farmers connected</small>
            </span>
            <span>
              <b>14,200+</b>
              <small>products traded</small>
            </span>
            <span>
              <b>18 states</b>
              <small>across India</small>
            </span>
          </div>
        </div>
        <div className="hero-orbit">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85"
            alt="Farmer caring for crops"
          />
          <span className="orbit-tag tag-one">Fresh from source</span>
          <span className="orbit-tag tag-two">
            <CheckCircle2 size={13} /> Verified farmer
          </span>
          <span className="orbit-tag tag-three">
            ₹28/kg <small>source price</small>
          </span>
        </div>
      </section>
      <section className="landing-motion platform-preview-section">
        <div className="landing-section-heading">
          <p className="eyebrow">ONE CLEAR VIEW OF THE NETWORK</p>
          <h2>
            Tools that make
            <br />
            <i>every move visible.</i>
          </h2>
          <p>Move from signal to decision with focused workspaces for every role.</p>
        </div>
        <div className="platform-preview-grid">
          <Link to="/buyer/dashboard" className="platform-preview-card preview-dashboard">
            <div className="preview-card-head"><span><LayoutDashboard size={14} /> Buyer workspace</span><em>LIVE</em></div>
            <h3>Spending overview</h3>
            <div className="preview-chart"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="preview-metrics"><span><b>₹2.4L</b><small>this month</small></span><span><b>12</b><small>active orders</small></span></div>
            <div className="preview-link">Open dashboard <ArrowRight size={14} /></div>
          </Link>
          <Link to="/ai-crop-advisor" className="platform-preview-card preview-advisor">
            <div className="preview-card-head"><span><Sparkles size={14} /> Crop advisor</span><em>FIELD PLAN</em></div>
            <h3>Tell us about your plot.</h3>
            <div className="preview-form-lines"><span /><span /><span /><b>Generate crop plan <ArrowRight size={13} /></b></div>
            <p>Soil, season, water, and local demand in one practical recommendation.</p>
          </Link>
          <Link to="/features/demand" className="platform-preview-card preview-insights">
            <div className="preview-card-head"><span><TrendingUp size={14} /> Demand forecasting</span><em>7 DAYS</em></div>
            <h3>Seven-day demand outlook</h3>
            <div className="preview-bars"><i /><i /><i /><i /><i /><i /></div>
            <div className="preview-insight-callout"><b>Tomato demand is HIGH</b><small>Recommended supply · 2,400 kg</small></div>
          </Link>
          <Link to="/logistics" className="platform-preview-card preview-logistics">
            <div className="preview-card-head"><span><Truck size={14} /> Logistics control</span><em>ON ROUTE</em></div>
            <h3>Nashik <ArrowRight size={13} /> Mumbai</h3>
            <div className="preview-route"><span /><i /><span /><i /><span /><i /><span /></div>
            <div className="preview-metrics"><span><b>08</b><small>active shipments</small></span><span><b>92%</b><small>on-time rate</small></span></div>
          </Link>
        </div>
      </section>
      <section className="landing-transition">
        <p className="eyebrow">A BETTER WAY TO BUY</p>
        <h2>
          Better Prices for Farmers.
          <br />
          <i>Better Value for Buyers.</i>
        </h2>
        <p>
          We make every step visible, so more value stays with the people who
          grow your food and every buyer knows what they are paying for.
        </p>
        <Link to="/impact" className="text-button">
          See the price difference <ArrowRight size={16} />
        </Link>
      </section>
      <section className="landing-section process-section" id="how">
        <div className="landing-section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>
            One marketplace.
            <br />
            <i>Two clear paths.</i>
          </h2>
          <p>Simple workflows for the people who grow, source and buy.</p>
        </div>
        <div className="process-grid">
          <article className="process-card farmer-process">
            <span className="process-icon">
              <Leaf size={18} />
            </span>
            <h3>For farmers & FPOs</h3>
            <p>
              List your harvest, set a fair price and reach buyers directly.
            </p>
            <ol>
              <li>List your produce</li>
              <li>Receive verified orders</li>
              <li>Pack at source</li>
              <li>Get paid directly</li>
            </ol>
            <Link to="/register" className="outline-button">
              Register as farmer <ArrowRight size={15} />
            </Link>
          </article>
          <article className="process-card buyer-process">
            <span className="process-icon">
              <ShoppingBasket size={18} />
            </span>
            <h3>For buyers & retailers</h3>
            <p>
              Find verified supply, compare prices and order with confidence.
            </p>
            <ol>
              <li>Browse fresh supply</li>
              <li>Compare transparent prices</li>
              <li>Choose delivery</li>
              <li>Track to your door</li>
            </ol>
            <Link to="/marketplace" className="outline-button">
              Shop fresh produce <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>
      <section className="landing-section fresh-section">
        <div className="landing-section-heading inline-heading">
          <div>
            <p className="eyebrow">FRESH TODAY</p>
            <h2>Fresh from the farm</h2>
            <p>Picked with care. Priced with purpose.</p>
          </div>
          <Link to="/marketplace" className="text-button">
            View marketplace <ArrowRight size={15} />
          </Link>
        </div>
        <div className="fresh-tabs">
          {["Vegetables", "Fruits", "Grains", "Spices"].map((category) => (
            <button
              className={
                activeCategory === category ? "fresh-tab active" : "fresh-tab"
              }
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="landing-product-grid">
          {catalog
            .filter(
              (product) =>
                activeCategory === "Vegetables" ||
                product.category === activeCategory,
            )
            .map((product) => (
              <Card key={product.id} product={product} add={addFeatured} />
            ))}
        </div>
      </section>
      <section className="transparency-section">
        <div>
          <p className="eyebrow light">PRICE TRANSPARENCY</p>
          <h2>
            See exactly where
            <br />
            <i>your money goes.</i>
          </h2>
          <p>
            Every order comes with a simple breakdown. No hidden markups. No
            mystery middlemen.
          </p>
          <Link to="/marketplace/tomato-01" className="warm-link">
            Explore a price breakdown <ArrowRight size={16} />
          </Link>
        </div>
        <div className="price-card">
          <div className="price-card-top">
            <span>Fresh Tomatoes · 1 kg</span>
            <b>₹28</b>
          </div>
          <div className="price-bar">
            <i />
            <i />
            <i />
            <i />
          </div>
          <p>
            <span>Farmer price</span>
            <b>₹18</b>
          </p>
          <p>
            <span>Collection & packing</span>
            <b>₹3</b>
          </p>
          <p>
            <span>Transportation</span>
            <b>₹5</b>
          </p>
          <p>
            <span>Platform cost</span>
            <b>₹2</b>
          </p>
          <hr />
          <p className="price-total">
            <span>Your price</span>
            <b>₹28/kg</b>
          </p>
          <small>Estimated demo data · 64% goes to farmer</small>
        </div>
      </section>
      <section className="impact-band">
        <p className="eyebrow light">REAL NUMBERS. REAL CHANGE.</p>
        <h2>
          Fairer trade starts
          <br />
          <i>with visibility.</i>
        </h2>
        <p>
          These are prototype metrics calculated from demo marketplace activity.
        </p>
        <div className="impact-stats">
          <span>
            <b>2,840+</b>
            <small>Farmers connected</small>
          </span>
          <span>
            <b>14,200+</b>
            <small>Products traded</small>
          </span>
          <span>
            <b>₹12.4 Cr</b>
            <small>Farmer revenue</small>
          </span>
          <span>
            <b>2.4 avg</b>
            <small>Intermediary steps avoided</small>
          </span>
        </div>
      </section>
      <section className="landing-cta">
        <div className="cta-card farmer-cta">
          <Leaf size={20} />
          <h3>Sell your produce directly</h3>
          <p>
            Reach more buyers, keep more value and build a trusted farm profile.
          </p>
          <Link to="/register" className="light-card-button">
            Register as farmer
          </Link>
        </div>
        <div className="cta-card buyer-cta">
          <ShoppingBasket size={20} />
          <h3>Buy fresh, save more</h3>
          <p>
            Find transparent prices and fresh produce from verified sources.
          </p>
          <Link to="/marketplace" className="warm-button">
            Shop fresh produce
          </Link>
        </div>
      </section>
      {notice && (
        <div className="toast-message">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}
    </div>
  );
}

function LegacyMarketplace({ add }: { add: (product: Product) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Top rated");
  const filtered = useMemo(() => {
    const result = (data?.data ?? []).filter(
      (p) =>
        (category === "All" || p.category === category) &&
        `${p.name} ${p.farmer} ${p.location}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
    return [...result].sort((a, b) =>
      sort === "Price: low to high" ? a.price - b.price : b.rating - a.rating,
    );
  }, [data, category, search, sort]);
  return (
    <section className="marketplace-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">VERIFIED SOURCES · PAN-INDIA</p>
          <h1>
            Agricultural
            <br />
            <i>Marketplace</i>
          </h1>
        </div>
        <p className="page-intro">
          12 products from verified farmers and FPOs across India. Compare
          quality, origin and farmer earnings in one clear view.
        </p>
      </div>
      <div className="market-toolbar">
        <label className="search-box">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce, farmer or place"
          />
        </label>
        <button className="filter-button">
          <Filter size={17} /> Filters
        </button>
        <label className="sort-select">
          Sort:{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Top rated</option>
            <option>Price: low to high</option>
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      <div className="catalog-meta">
        <span>{filtered.length} products available</span>
        <span className="demo-label">All prices are simulated demo data</span>
      </div>
      <div className="chips">
        {categories.map((item) => (
          <button
            className={category === item ? "chip active" : "chip"}
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="loading-state">Loading fresh harvests...</div>
      ) : filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <Card key={p.id} product={p} add={add} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No products found. Try another search.
        </div>
      )}
    </section>
  );
}

function Marketplace({ add }: { add: (product: Product) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [sort, setSort] = useState("Top rated");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [region, setRegion] = useState("All states");
  const filtered = useMemo(() => {
    const result = (data?.data ?? []).filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (region === "All states" || p.location.includes(region)) &&
        (!organicOnly || p.organic) &&
        `${p.name} ${p.farmer} ${p.location}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
    return [...result].sort((a, b) =>
      sort === "Price: low to high"
        ? a.price - b.price
        : sort === "Price: high to low"
          ? b.price - a.price
          : b.rating - a.rating,
    );
  }, [data, category, search, sort, organicOnly, region]);
  const resetFilters = () => {
    setCategory("All");
    setOrganicOnly(false);
    setRegion("All states");
    setSearch("");
    setSort("Top rated");
  };
  const activeFilterCount = Number(category !== "All") + Number(organicOnly) + Number(region !== "All states") + Number(Boolean(search));
  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">VERIFIED SOURCES · PAN-INDIA</p>
          <h1>
            India's best <i>marketplace</i>
          </h1>
          <p>
            Fresh produce, transparent prices and trusted farmers in one place.
          </p>
        </div>
        <div className="catalog-actions">
          <label className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, farmers..."
            />
          </label>
          <label className="sort-select">
            Sort:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Top rated</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
      </div>
      <div className="marketplace-highlight">
        <div>
          <span className="highlight-icon">
            <TrendingUp size={17} />
          </span>
          <div>
            <b>Demand is up 18% this week</b>
            <small>Tomatoes, mangoes and rice are trending near you</small>
          </div>
        </div>
        <span className="highlight-note">2,840+ verified farmers</span>
      </div>
      <div className="marketplace-proof" aria-label="Marketplace highlights">
        <span><strong>24-48h</strong><small>Typical dispatch</small></span>
        <span><strong>₹0</strong><small>Buyer platform fee</small></span>
        <span><strong>4.8/5</strong><small>Average seller rating</small></span>
        <span><strong>100%</strong><small>Traceable origins</small></span>
      </div>
      <div className="catalog-layout">
        <aside className="filter-rail">
          <div className="filter-title">
            <b>REFINE RESULTS {activeFilterCount > 0 && <em>{activeFilterCount}</em>}</b>
            <button onClick={resetFilters}>Reset all</button>
          </div>
          <div className="filter-section">
            <span>
              Category <ChevronDown size={14} />
            </span>
            {categories.map((item) => (
              <button
                className={
                  category === item ? "filter-choice active" : "filter-choice"
                }
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="filter-section">
            <span>
              Region / State <ChevronDown size={14} />
            </span>
            {[
              "All states",
              "Gujarat",
              "Maharashtra",
              "Karnataka",
              "Madhya Pradesh",
              "Tamil Nadu",
            ].map((item) => (
              <button
                className={
                  region === item ? "filter-choice active" : "filter-choice"
                }
                key={item}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="filter-section">
            <span>
              Product type <ChevronDown size={14} />
            </span>
            <label className="check-choice">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
              />{" "}
              Organic only
            </label>
            <label className="check-choice">
              <input type="checkbox" defaultChecked /> Verified seller
            </label>
          </div>
        </aside>
        <div className="catalog-results">
          <div className="catalog-meta">
            <span>{filtered.length} products available</span>
            <span className="demo-label">
              Live demo marketplace · updated today
            </span>
          </div>
          {isLoading ? (
            <div className="loading-state">Loading fresh harvests...</div>
          ) : filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <Card key={p.id} product={p} add={add} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={28} />
              <h2>No harvests match those filters</h2>
              <p>Try a wider region or clear your filters to see every available listing.</p>
              <button className="primary-button" type="button" onClick={resetFilters}>Clear filters <ArrowRight size={15} /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({
  product,
  add,
}: {
  product: Product;
  add: (product: Product) => void;
}) {
  const [addedCount, setAddedCount] = useState(0);
  const stockLabel = product.quantity > 3000 ? "In stock" : product.quantity > 500 ? "Limited stock" : "Selling fast";
  const farmerShare = Math.round(product.price * 0.84);
  const handleAdd = () => {
    add(product);
    setAddedCount((count) => count + 1);
  };
  return (
    <article className="product-card" style={{ "--product-accent": product.accent } as React.CSSProperties}>
      <Link to={`/marketplace/${product.id}`} className="product-image">
        <img
          src={product.image}
          alt={`${product.name} from ${product.location}`}
          style={{ objectPosition: product.category === "Fruits" ? "center 42%" : "center" }}
        />
        <span className="origin-tag">
          <MapPin size={12} /> {product.location.split(",")[0]}
        </span>
        {product.organic && <span className="organic-tag">Organic</span>}
        <FavoriteButton productId={product.id} />
      </Link>
      <div className="product-info">
        <div className="product-top">
          <div>
            <Link to={`/marketplace/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
            <p>{product.farmer}</p>
          </div>
          <span className="rating">
            <Star size={13} fill="currentColor" /> {product.rating}
          </span>
        </div>
        <div className="product-meta-row">
          <span><ShieldCheck size={12} /> {product.quality}</span>
          <span><Clock3 size={12} /> Harvest {product.harvest}</span>
        </div>
        <div className="product-transparency">
          <span><b>₹{farmerShare}</b> goes to farmer</span>
          <span className={stockLabel === "Selling fast" ? "stock-alert" : "stock-good"}>{stockLabel}</span>
        </div>
        <div className="product-bottom">
          <div>
            <strong>₹{product.price}</strong>
            <small> / {product.unit}</small>
            <span>
              {product.quantity.toLocaleString()} {product.unit} available
            </span>
          </div>
          <button
            className="add-button"
            type="button"
            aria-label="Add to cart"
            onClick={handleAdd}
          >
            {addedCount ? <><Check size={17} /><span>{addedCount}</span></> : <Plus size={19} />}
          </button>
        </div>
        <CompareButton productId={product.id} />
      </div>
    </article>
  );
}

function Detail({ add }: { add: (product: Product) => void }) {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });
  const product = data?.data.find((p) => p.id === id);
  if (isLoading) return <div className="loading-state">Loading product...</div>;
  if (!product)
    return (
      <section className="empty-state">
        <h2>Product not found</h2>
        <p>That listing may have been removed or the link is incorrect.</p>
        <Link className="primary-button" to="/marketplace">
          Back to marketplace <ArrowRight size={15} />
        </Link>
      </section>
    );
  const sales = [32, 46, 41, 58, 64, 72, 86].map((value, index) => ({
    week: `W${index + 1}`,
    sales: value + (product.price % 9),
  }));
  const demand = [
    { label: "Local", value: 62 },
    { label: "Retail", value: 78 },
    { label: "Hotels", value: 54 },
    { label: "Export", value: 39 },
  ];
  const farmerPhone = "+91 98765 43210";
  const farmerId = `DM-FR-${product.id.slice(0, 5).toUpperCase()}`;
  return (
    <section className="detail-page">
      <Link className="back-link" to="/marketplace">
        ← Back to marketplace
      </Link>
      <div className="detail-grid">
        <div>
          <div className="detail-image-wrap">
            <img
              className="detail-image"
              src={product.image}
              alt={product.name}
            />
            <span className="detail-image-badge">
              <ShieldCheck size={14} /> Verified harvest
            </span>
            <FavoriteButton productId={product.id} />
          </div>
          <div className="detail-facts">
            <span>
              <b>{product.quality}</b>
              <small>Quality grade</small>
            </span>
            <span>
              <b>{product.harvest}</b>
              <small>Harvest date</small>
            </span>
            <span>
              <b>
                {product.quantity.toLocaleString()} {product.unit}
              </b>
              <small>Available now</small>
            </span>
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {product.category} · {product.quality}
          </p>
          <h1>{product.name}</h1>
          <p className="detail-farmer">
            <span className="avatar mini">
              {product.farmer.slice(0, 2).toUpperCase()}
            </span>{" "}
            Grown by <b>{product.farmer}</b> · {product.location}
          </p>
          <div className="detail-price">
            <strong>₹{product.price}</strong> / {product.unit}
            <span>
              <Star size={15} fill="currentColor" /> {product.rating} · 36
              reviews
            </span>
          </div>
          <p className="detail-description">
            Carefully grown, sorted and packed at source. {product.name} is
            selected for consistent quality and a shorter, more transparent
            supply chain. Every order supports the farmer who produced it.
          </p>
          <button className="primary-button" onClick={() => add(product)}>
            Add to basket <ShoppingBasket size={17} />
          </button>
          <div className="seller-card">
            <div className="seller-heading">
              <span className="avatar mini">
                {product.farmer.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <b>{product.farmer}</b>
                <small>
                  <ShieldCheck size={12} /> Verified farmer / FPO
                </small>
              </div>
            </div>
            <div className="seller-details">
              <span>
                <UserRound size={14} /> User ID <b>{farmerId}</b>
              </span>
              <span>
                <Phone size={14} /> Phone <b>{farmerPhone}</b>
              </span>
              <span>
                <MapPin size={14} /> Pickup <b>{product.location}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="detail-analytics">
        <div className="analytics-heading">
          <div>
            <p className="eyebrow">PRODUCT PERFORMANCE</p>
            <h2>
              Sales & demand <i>analytics</i>
            </h2>
            <p>
              Signals from the last 7 weeks across the Direct Market network.
            </p>
          </div>
          <span className="trend-pill">
            <TrendingUp size={14} /> +18.6%
          </span>
        </div>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="panel-title">
              <h3>Weekly sales volume</h3>
              <span>units sold</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={sales}>
                <defs>
                  <linearGradient
                    id="productSalesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#9fbd61" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#9fbd61"
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e9eee7" />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#7a857e" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#7a857e" }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #dfe4db",
                    borderRadius: 10,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#5d8a52"
                  strokeWidth={2.5}
                  fill="url(#productSalesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="analytics-card">
            <div className="panel-title">
              <h3>Demand by buyer</h3>
              <span>interest index</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={demand} layout="vertical">
                <CartesianGrid horizontal={false} stroke="#e9eee7" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#7a857e" }}
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #dfe4db",
                    borderRadius: 10,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="value" fill="#d4e293" radius={[0, 7, 7, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="analytics-summary">
          <span>
            <b>82%</b>
            <small>Demand confidence</small>
          </span>
          <span>
            <b>3.4 days</b>
            <small>Average sell-through</small>
          </span>
          <span>
            <b>₹{(product.price * 1.12).toFixed(0)}</b>
            <small>Expected next-week price</small>
          </span>
        </div>
      </div>
      <div className="transparency">
        <div>
          <p className="eyebrow">PRICE TRANSPARENCY</p>
          <span>Estimated / Demo data</span>
        </div>
        <p>
          Farmer price{" "}
          <b>
            ₹{Math.max(1, product.price - 7)}/{product.unit}
          </b>
        </p>
        <p>
          Collection & packing <b>₹3/{product.unit}</b>
        </p>
        <p>
          Transportation <b>₹3/{product.unit}</b>
        </p>
        <p>
          Platform cost <b>₹1/{product.unit}</b>
        </p>
        <hr />
        <p className="final-line">
          Your price{" "}
          <b>
            ₹{product.price}/{product.unit}
          </b>
        </p>
      </div>
    </section>
  );
}

function Cart({
  items,
  change,
}: {
  items: CartItem[];
  change: (id: string, amount: number) => void;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  return (
    <section className="cart-page">
      <p className="eyebrow">YOUR BASKET</p>
      <h1>
        Ready when <i>you are.</i>
      </h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <ShoppingBasket size={32} />
          <h3>Your basket is waiting</h3>
          <p>Add a few harvests from the marketplace to get started.</p>
          <Link to="/marketplace" className="primary-button">
            Explore produce <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-row" key={item.product.id}>
                <img src={item.product.image} alt="" />
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.farmer}</p>
                  <strong>
                    ₹{item.product.price} <small>/ {item.product.unit}</small>
                  </strong>
                </div>
                <div className="stepper">
                  <button
                    aria-label={`Remove one ${item.product.name}`}
                    onClick={() => change(item.product.id, -1)}
                  >
                    <Minus size={14} />
                  </button>
                  <b>{item.quantity}</b>
                  <button
                    aria-label={`Add one ${item.product.name}`}
                    onClick={() => change(item.product.id, 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <div>
              <span>Produce subtotal</span>
              <b>₹{subtotal}</b>
            </div>
            <div>
              <span>Estimated logistics</span>
              <b>₹{subtotal ? 42 : 0}</b>
            </div>
            <div>
              <span>Platform cost</span>
              <b>₹{subtotal ? 12 : 0}</b>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <b>₹{subtotal + (subtotal ? 54 : 0)}</b>
            </div>
            <Link to="/checkout" className="primary-button">
              Continue to checkout <ArrowRight size={16} />
            </Link>
            <small className="demo-note">
              Demo checkout · no real payment required
            </small>
          </aside>
        </div>
      )}
    </section>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState<UserRole | "">("");
  const roleOptions: Array<[UserRole, string]> = [
    ["farmer", "Farmer"],
    ["consumer", "Consumer"],
    ["bulk-buyer", "Buyer"],
    ["admin", "Admin"],
  ];
  const signIn = async () => {
    const loginEmail = email.trim();
    const loginPassword = password;
    const loginRole = role;
    if (!loginEmail || loginPassword.length < 4 || !loginRole) {
      setError("Enter your email, password, and select the account role.");
      return;
    }
    const result = await authService.login(
      loginEmail,
      loginPassword,
      loginRole,
    );
    if (!result.success || !result.data) {
      setError(
        result.message || "Email, password, or selected role does not match.",
      );
      return;
    }
    const destination =
      result.data.role === "admin"
        ? "/admin/dashboard"
        : result.data.role === "farmer"
          ? "/farmer/dashboard"
          : result.data.role === "bulk-buyer"
            ? "/buyer/dashboard"
            : "/marketplace";
    navigate(destination);
  };
  const signInAsDemo = async (
    demoRole: Extract<UserRole, "farmer" | "bulk-buyer" | "admin">,
  ) => {
    setError("");
    setDemoLoading(demoRole);
    const result = await authService.demoLogin(demoRole);
    setDemoLoading("");
    if (result.success && result.data) {
      navigate(
        demoRole === "admin"
          ? "/admin/dashboard"
          : demoRole === "farmer"
            ? "/farmer/dashboard"
            : "/buyer/dashboard",
      );
      return;
    }
    setError(result.message || "Demo sign in failed.");
  };
  return (
    <section className="auth-page">
      <div className="auth-story">
        <Link className="auth-brand" to="/">
          <span className="mark">
            <Leaf size={18} />
          </span>{" "}
          KisanBazaar
        </Link>
        <h1>
          Direct connections.
          <br />
          <b>Transparent prices.</b>
          <br />
          Smarter supply chains.
        </h1>
        <p>
          Join farmers and buyers building a fairer agricultural marketplace
          without the middlemen.
        </p>
        <div className="auth-points">
          <span>
            <ShieldCheck size={17} /> Full price transparency
          </span>
          <span>
            <ArrowRight size={17} /> Farmers earn more at source
          </span>
          <span>
            <Truck size={17} /> Managed logistics across India
          </span>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-tabs">
          <Link className="active" to="/login">
            Sign In
          </Link>
          <Link to="/register">Create Account</Link>
        </div>
        <p className="eyebrow">WELCOME BACK</p>
        <h2>Welcome back</h2>
        <p className="muted">
          Choose the same role you selected during registration.
        </p>
        <div
          className="login-role-picker"
          role="group"
          aria-label="Account role"
        >
          {roleOptions.map(([value, label]) => (
            <button
              type="button"
              className={role === value ? "active" : ""}
              key={value}
              onClick={() => {
                setRole(value);
                setError("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          Email address
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button" onClick={() => void signIn()}>
          Sign in <ArrowRight size={16} />
        </button>
        <div className="demo-accounts">
          <button
            disabled={Boolean(demoLoading)}
            onClick={() => void signInAsDemo("farmer")}
          >
            {demoLoading === "farmer" ? "Opening..." : "Farmer demo"}
          </button>
          <button
            disabled={Boolean(demoLoading)}
            onClick={() => void signInAsDemo("bulk-buyer")}
          >
            {demoLoading === "bulk-buyer" ? "Opening..." : "Buyer demo"}
          </button>
          <button
            disabled={Boolean(demoLoading)}
            onClick={() => void signInAsDemo("admin")}
          >
            {demoLoading === "admin" ? "Opening..." : "Admin demo"}
          </button>
        </div>
        <p className="auth-footer">
          New to the marketplace? <Link to="/register">Create an account</Link>
        </p>
        <small className="auth-note">
          Sessions are verified by the MongoDB-backed API using an HTTP-only JWT
          cookie.
        </small>
      </div>
    </section>
  );
}
function AuthGuard({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void authService.getCurrentUser().then((session) => {
      if (!active) return;
      if (
        !session ||
        (session.role !== role &&
          !(role === "consumer" && session.role === "bulk-buyer"))
      )
        navigate("/login", { replace: true });
      else setReady(true);
    });
    return () => {
      active = false;
    };
  }, [navigate, role]);
  return ready ? (
    <>{children}</>
  ) : (
    <div className="loading-state">Checking your JWT session...</div>
  );
}
function SessionGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void authService.getCurrentUser().then((session) => {
      if (!active) return;
      if (!session) navigate("/login", { replace: true });
      else setReady(true);
    });
    return () => {
      active = false;
    };
  }, [navigate]);
  return ready ? (
    <>{children}</>
  ) : (
    <div className="loading-state">Checking your JWT session...</div>
  );
}
function ProfileMenu({
  session,
  ready,
}: {
  session: Session | null;
  ready: boolean;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".profile-menu")) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const dashboard =
    session?.role === "admin"
      ? "/admin/dashboard"
      : session?.role === "farmer"
        ? "/farmer/dashboard"
        : session?.role === "bulk-buyer"
          ? "/buyer/dashboard"
          : "/login";
  if (!ready) return null;
  if (!session) return null;
  return (
    <div className="profile-menu">
      <button
        className="avatar"
        aria-label="Open profile menu"
        onClick={() => navigate("/profile")}
      >
        {session.name.slice(0, 2).toUpperCase()}
      </button>
      {open && (
        <div className="profile-dropdown">
          <b>{session.name}</b>
          <small>{session.email}</small>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            <UserRound size={14} /> My profile
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate(dashboard);
            }}
          >
            <LayoutDashboard size={14} /> My dashboard
          </button>
          <button
            onClick={() => {
              void authService.logout();
              setOpen(false);
              navigate("/login");
            }}
          >
            <X size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function PortalShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const portal = location.pathname.split("/")[1];
  const portalLinks =
    portal === "farmer"
      ? [
        ["Dashboard", "/farmer/dashboard", LayoutDashboard],
        ["Products", "/farmer/products", Package],
        ["Inventory", "/farmer/inventory", Boxes],
        ["Orders", "/farmer/orders", ClipboardList],
        ["AI insights", "/farmer/ai", Sparkles],
      ]
      : portal === "buyer"
        ? [
          ["Dashboard", "/buyer/dashboard", LayoutDashboard],
          ["Orders", "/buyer/orders", ClipboardList],
          ["Favorites", "/buyer/favorites", Star],
          ["Recommendations", "/buyer/recommendations", Sparkles],
        ]
        : [
          ["Dashboard", "/admin/dashboard", LayoutDashboard],
          ["Users", "/admin/users", Users],
          ["Products", "/admin/products", Package],
          ["Orders", "/admin/orders", ClipboardList],
          ["Logistics", "/admin/logistics", Truck],
          ["Analytics", "/admin/analytics", BarChart3],
        ];
  const isPortal = ["farmer", "buyer", "admin"].includes(portal);
  const dashboard =
    session?.role === "admin"
      ? "/admin/dashboard"
      : session?.role === "farmer"
        ? "/farmer/dashboard"
        : session?.role === "bulk-buyer"
          ? "/buyer/dashboard"
          : "/login";
  const addProduct = (product: Product) => {
    addToStoredCart(product);
    setCartVersion((version) => version + 1);
  };
  useEffect(() => {
    let active = true;
    void authService.getCurrentUser().then((user) => {
      if (active) {
        setSession(user);
        setSessionReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [location.pathname]);
  void cartVersion;
  return (
    <div className={isPortal ? "portal-layout" : "app-shell"}>
      {isPortal && (
        <aside className={open ? "portal-sidebar open" : "portal-sidebar"}>
          <Link className="wordmark portal-wordmark" to="/">
            <span className="mark">
              <Leaf size={18} />
            </span>
            <span>KisanBazaar</span>
          </Link>
          <div className="portal-label">{portal} portal</div>
          {portalLinks.map(([label, to, Icon]) => (
            <Link
              key={to as string}
              className={location.pathname === to ? "side-active" : ""}
              to={to as string}
              onClick={() => setOpen(false)}
            >
              {Icon && <Icon size={17} />}
              <span>{label as string}</span>
            </Link>
          ))}
          <Link className="side-back" to="/marketplace">
            ← Back to marketplace
          </Link>
        </aside>
      )}
      <header className={scrolled ? "topbar scrolled" : "topbar"}>
        <Link className="wordmark" to="/">
          <span className="mark">
            <Leaf size={18} />
          </span>
          <span>
            KisanBazaar
          </span>
        </Link>
        <label className="mobile-topbar-search">
          <Search size={16} />
          <input
            aria-label="Search products"
            placeholder="Search product"
            onKeyDown={(event) => {
              if (event.key === "Enter")
                navigate(
                  `/marketplace?search=${encodeURIComponent(event.currentTarget.value)}`,
                );
            }}
          />
        </label>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/directory">Toolkit</Link>
          <details className="feature-nav">
            <summary>
              Features <ChevronDown size={14} />
            </summary>
            <div className="feature-nav-menu">
              <Link to="/directory" onClick={() => setOpen(false)}>All tools</Link>
              <Link to="/reviews" onClick={() => setOpen(false)}>Reviews</Link>
              <Link to="/ai-crop-advisor" onClick={() => setOpen(false)}>AI Crop Advisor</Link>
              <Link to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
              <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
              {insightFeatures.map((feature) => (
                <Link key={feature.kind} to={`/features/${feature.kind}`} onClick={() => setOpen(false)}>
                  {feature.label}
                </Link>
              ))}
            </div>
          </details>
          <Link to="/logistics">Logistics</Link>
          <Link className="nav-dashboard" to={dashboard}>
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link to="/impact">Impact</Link>
          {!session && (
            <>
              <Link to="/login" className="nav-sell">
                Sign in <ArrowRight size={15} />
              </Link>
              <Link to="/register" className="nav-register">Create account</Link>
            </>
          )}
        </nav>
        <div className="top-actions">
          <button
            className="menu-button"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          {session && <NotificationCenter />}
          {session && (
            <button className="icon-button" aria-label="Cart" onClick={() => navigate("/cart")}>
              <ShoppingCart size={20} />
              {cartVersion > 0 && <em>{getStoredCart().reduce((sum, item) => sum + item.quantity, 0)}</em>}
            </button>
          )}
          <ProfileMenu session={session} ready={sessionReady} />
        </div>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                session={session}
                add={(product) => {
                  addProduct(product);
                  navigate("/cart");
                }}
              />
            }
          />
          <Route
            path="/marketplace"
            element={<Marketplace add={addProduct} />}
          />
          <Route
            path="/marketplace/:id"
            element={
              <SessionGuard>
                <EnhancedDetail add={addProduct} />
              </SessionGuard>
            }
          />
          <Route
            path="/cart"
            element={
              <SessionGuard>
                <PersistentCart />
              </SessionGuard>
            }
          />
          <Route
            path="/compare"
            element={
              <SessionGuard>
                <ComparisonPage />
              </SessionGuard>
            }
          />
          <Route
            path="/reviews"
            element={
              <SessionGuard>
                <ReviewsPage />
              </SessionGuard>
            }
          />
          <Route
            path="/ai-crop-advisor"
            element={
              <SessionGuard>
                <CropAdvisor />
              </SessionGuard>
            }
          />
          <Route path="/directory" element={<FeatureDirectory />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route
            path="/features"
            element={
              <SessionGuard>
                <FeatureHub />
              </SessionGuard>
            }
          />
          <Route
            path="/features/:kind"
            element={
              <SessionGuard>
                <MarketInsights />
              </SessionGuard>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<SessionProfile />} />
          <Route
            path="/checkout"
            element={
              <SessionGuard>
                <Checkout />
              </SessionGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <SessionGuard>
                <Orders />
              </SessionGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <SessionGuard>
                <OrderDetail />
              </SessionGuard>
            }
          />
          <Route
            path="/logistics"
            element={
              <SessionGuard>
                <Logistics />
              </SessionGuard>
            }
          />
          <Route
            path="/farmer/inventory"
            element={
              <AuthGuard role="farmer">
                <FarmerInventory />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/products/new"
            element={
              <AuthGuard role="farmer">
                <WorkflowWorkspace role="farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <AuthGuard role="farmer">
                <WorkflowWorkspace role="farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <AuthGuard role="farmer">
                <WorkflowWorkspace role="farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/earnings"
            element={
              <AuthGuard role="farmer">
                <WorkflowWorkspace role="farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/ai"
            element={
              <AuthGuard role="farmer">
                <WorkflowWorkspace role="farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/farmer/*"
            element={
              <AuthGuard role="farmer">
                <PortalPage role="Farmer" />
              </AuthGuard>
            }
          />
          <Route
            path="/buyer/favorites"
            element={
              <SessionGuard>
                <BuyerFavorites />
              </SessionGuard>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <AuthGuard role="bulk-buyer">
                <WorkflowWorkspace role="buyer" />
              </AuthGuard>
            }
          />
          <Route
            path="/buyer/recommendations"
            element={
              <AuthGuard role="bulk-buyer">
                <WorkflowWorkspace role="buyer" />
              </AuthGuard>
            }
          />
          <Route
            path="/buyer/*"
            element={
              <AuthGuard role="bulk-buyer">
                <PortalPage role="Buyer" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthGuard role="admin">
                <WorkflowWorkspace role="admin" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AuthGuard role="admin">
                <WorkflowWorkspace role="admin" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AuthGuard role="admin">
                <WorkflowWorkspace role="admin" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/logistics"
            element={
              <AuthGuard role="admin">
                <WorkflowWorkspace role="admin" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AuthGuard role="admin">
                <WorkflowWorkspace role="admin" />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AuthGuard role="admin">
                <PortalPage role="Admin" />
              </AuthGuard>
            }
          />
        </Routes>
      </main>
      <nav className="bottom-nav">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          <Leaf size={19} />
          <span>Home</span>
        </Link>
        <Link
          className={location.pathname.includes("marketplace") ? "active" : ""}
          to="/marketplace"
        >
          <Package size={19} />
          <span>Products</span>
        </Link>
        <Link
          className={location.pathname.includes("favorites") ? "active" : ""}
          to="/buyer/favorites"
        >
          <Star size={19} />
          <span>Favourite</span>
        </Link>
        <Link
          className={location.pathname === "/profile" ? "active" : ""}
          to={session ? "/profile" : "/login"}
        >
          <UserRound size={19} />
          <span>Profile</span>
        </Link>
      </nav>
      <ShoppingAssistant />
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Consumer");
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const fields =
    role === "Farmer"
      ? [
        ["Full name", "Your full name"],
        ["Farm / FPO name", "e.g. Sunrise Growers"],
        ["Location", "Village, district, state"],
        ["Primary crop", "e.g. Tomatoes, wheat"],
      ]
      : role === "Bulk Buyer"
        ? [
          ["Contact person", "Your full name"],
          ["Business name", "Company or institution"],
          ["Business type", "Retailer, processor or hotel"],
          ["Delivery city", "City and state"],
        ]
        : [
          ["Full name", "Your full name"],
          ["Delivery address", "House, street and city"],
        ];
  const submit = async () => {
    if (!email.trim() || password.length < 8 || password !== confirm) {
      setError(
        "Enter a valid email, an 8+ character password, and matching passwords.",
      );
      return;
    }
    const userRole: UserRole =
      role === "Farmer"
        ? "farmer"
        : role === "Bulk Buyer"
          ? "bulk-buyer"
          : "consumer";
    const result = await authService.register(name, email, password, userRole);
    if (!result.success || !result.data) {
      setError(result.message);
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(
      () =>
        navigate(
          userRole === "farmer"
            ? "/farmer/dashboard"
            : userRole === "bulk-buyer"
              ? "/buyer/dashboard"
              : "/marketplace",
        ),
      500,
    );
  };
  return (
    <section className="auth-page register-auth">
      <div className="auth-story">
        <Link className="auth-brand" to="/">
          <span className="mark">
            <Leaf size={18} />
          </span>{" "}
          KisanBazaar
        </Link>
        <p className="eyebrow">BUILD A FAIRER CHAIN</p>
        <h1>
          Your account,
          <br />
          <b>your market.</b>
        </h1>
        <p>
          Choose your role and create a workspace tailored to how you grow,
          source or buy.
        </p>
        <div className="auth-points">
          <span>
            <ShieldCheck size={17} /> Verified marketplace access
          </span>
          <span>
            <Users size={17} /> Connect with trusted partners
          </span>
          <span>
            <Truck size={17} /> Track every order end to end
          </span>
        </div>
      </div>
      <div className="auth-form register-form">
        <div className="auth-tabs">
          <Link to="/login">Sign In</Link>
          <Link className="active" to="/register">
            Create Account
          </Link>
        </div>
        <p className="eyebrow">CREATE YOUR ACCOUNT</p>
        <h2>Join the marketplace</h2>
        <p className="muted">
          Start with a few details. You can complete your profile later.
        </p>
        <div className="role-picker">
          {["Farmer", "Consumer", "Bulk Buyer"].map((item) => (
            <button
              className={role === item ? "role active" : "role"}
              key={item}
              onClick={() => setRole(item)}
            >
              <UserRound size={16} />
              {item}
            </button>
          ))}
        </div>
        <div className="register-fields">
          {fields.map(([label, placeholder], index) => (
            <label key={label}>
              {label}
              <input
                value={index === 0 ? name : undefined}
                onChange={
                  index === 0
                    ? (event) => setName(event.target.value)
                    : undefined
                }
                placeholder={placeholder}
              />
            </label>
          ))}
        </div>
        <label>
          Email address
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <div className="auth-field-row">
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Re-enter password"
            />
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        {submitted && (
          <p className="success-message">
            Account created successfully. Opening your workspace...
          </p>
        )}
        <button className="primary-button" onClick={() => void submit()}>
          Create account <ArrowRight size={16} />
        </button>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

function Checkout() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [slot, setSlot] = useState("Tomorrow · 9:00 AM – 12:00 PM");
  const [payment, setPayment] = useState("UPI");
  const [error, setError] = useState("");
  const steps = ["Cart", "Address", "Delivery", "Payment", "Confirmation"];
  const next = () => {
    if (step === 1 && getStoredCart().length === 0) {
      setError("Add at least one product to your cart before checkout.");
      return;
    }
    if (step === 2 && address.trim().length < 10) {
      setError("Add a complete delivery address to continue.");
      return;
    }
    setError("");
    if (step === 4) {
      localStorage.removeItem(cartStorageKey);
      localStorage.setItem("direct-market-cart-count", "0");
    }
    setStep((value) => value + 1);
  };
  return (
    <section className="checkout-page">
      <p className="eyebrow">DEMO CHECKOUT</p>
      <h1>
        From basket to
        <br />
        <i>front door.</i>
      </h1>
      <div className="checkout-steps">
        {steps.map((item, index) => (
          <div
            className={
              index + 1 <= step ? "checkout-step active" : "checkout-step"
            }
            key={item}
          >
            <span>{index + 1}</span>
            {item}
          </div>
        ))}
      </div>
      <div className="checkout-panel">
        <h2>{steps[step - 1]}</h2>
        {step < 5 ? (
          <>
            <p className="muted">
              {step === 1
                ? "Review your produce and estimated costs."
                : step === 2
                  ? "Where should we deliver this order?"
                  : step === 3
                    ? "Choose a delivery window for your harvest."
                    : "Select a simulated payment method."}
            </p>
            {step === 1 && (
              <div className="checkout-review">
                <span>
                  <b>Fresh produce basket</b>
                  <small>Verified farmer supply · quantity confirmed</small>
                </span>
                <strong>Ready to reserve</strong>
              </div>
            )}
            {step === 2 && (
              <label className="checkout-field">
                Delivery address
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House, street, city, state and PIN code"
                />
              </label>
            )}
            {step === 3 && (
              <div className="checkout-choice-grid">
                {[
                  "Tomorrow · 9:00 AM – 12:00 PM",
                  "Tomorrow · 2:00 PM – 6:00 PM",
                  "Saturday · 9:00 AM – 12:00 PM",
                ].map((item) => (
                  <button
                    className={slot === item ? "selected" : ""}
                    key={item}
                    onClick={() => setSlot(item)}
                  >
                    <Truck size={16} />
                    <span>{item}</span>
                    {slot === item && <CheckCircle2 size={15} />}
                  </button>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="payment-options">
                {["UPI", "Card", "Cash on Delivery"].map((item) => (
                  <button
                    className={payment === item ? "selected" : ""}
                    key={item}
                    onClick={() => setPayment(item)}
                  >
                    {item}
                    {payment === item && <CheckCircle2 size={14} />}
                  </button>
                ))}
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
            <div className="checkout-actions">
              {step > 1 && (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setError("");
                    setStep((value) => value - 1);
                  }}
                >
                  Back
                </button>
              )}
              <button className="primary-button" onClick={next}>
                {step === 4 ? `Place demo order · ${payment}` : "Continue"}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 size={38} color="#5e985f" />
            <h3>Order confirmed</h3>
            <p className="muted">
              Your demo order DM-2048 is confirmed for {slot}. The farmer has
              been notified.
            </p>
            <Link className="primary-button" to="/orders/DM-2048">
              Track order <ArrowRight size={16} />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

function Orders() {
  return (
    <section className="workflow-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">YOUR ACTIVITY</p>
          <h1>
            Orders &<br />
            <i>deliveries.</i>
          </h1>
        </div>
        <Link to="/marketplace" className="outline-button">
          Shop produce <ArrowRight size={16} />
        </Link>
      </div>
      <div className="order-table">
        <div className="table-head">
          <span>Order</span>
          <span>Items</span>
          <span>Status</span>
          <span>Total</span>
          <span />
        </div>
        {[
          ["DM-2048", "Fresh Tomatoes · 5 kg", "In transit", "₹177"],
          ["DM-2016", "Sona Masuri Rice · 10 kg", "Delivered", "₹734"],
          ["DM-1984", "Red Onions · 8 kg", "Delivered", "₹302"],
        ].map((order) => (
          <Link className="table-row" to={`/orders/${order[0]}`} key={order[0]}>
            <b>{order[0]}</b>
            <span>{order[1]}</span>
            <span className="status">{order[2]}</span>
            <b>{order[3]}</b>
            <ArrowRight size={15} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function OrderDetail() {
  const { id } = useParams();
  return (
    <section className="workflow-page">
      <Link className="back-link" to="/orders">
        ← All orders
      </Link>
      <div className="order-detail-head">
        <div>
          <p className="eyebrow">ORDER {id ?? "UNKNOWN"}</p>
          <h1>
            Track your
            <br />
            <i>delivery.</i>
          </h1>
        </div>
        <span className="status large">Live updates</span>
      </div>
      <OrderTrackingPanel orderId={id} />
    </section>
  );
}

function Logistics() {
  const [selectedId, setSelectedId] = useState("MH-TRK-08");
  const [optimizing, setOptimizing] = useState(false);
  const shipments = [
    { id: "MH-TRK-08", route: "Nashik → Mumbai", status: "In transit", eta: "Today, 6:00 PM", cargo: "Fresh tomatoes", weight: "2,400 kg", distance: "184 km", duration: "4h 20m", cost: "₹8,420", utilization: 78, active: true },
    { id: "KA-VAN-12", route: "Mandya → Bengaluru", status: "Pickup scheduled", eta: "Tomorrow, 8:30 AM", cargo: "Sona Masuri rice", weight: "1,800 kg", distance: "142 km", duration: "3h 10m", cost: "₹6,180", utilization: 62, active: false },
    { id: "GJ-TRK-04", route: "Anand → Surat", status: "Pending dispatch", eta: "Sep 06, 10:00 AM", cargo: "Organic vegetables", weight: "1,150 kg", distance: "96 km", duration: "2h 05m", cost: "₹4,760", utilization: 91, active: false },
  ];
  const selected = shipments.find((shipment) => shipment.id === selectedId) ?? shipments[0];
  const optimize = () => {
    setOptimizing(true);
    window.setTimeout(() => setOptimizing(false), 900);
  };
  return (
    <section className="logistics-dashboard">
      <div className="logistics-hero">
        <div className="logistics-title"><span className="logistics-icon"><Truck size={25} /></span><div><p className="eyebrow">OPERATIONS CONTROL CENTRE</p><h1>Logistics &amp; Routes</h1><p>Real-time shipment tracking with AI-optimized route visualization</p></div></div>
        <span className="ai-route-badge"><Sparkles size={15} /> AI Route Optimization <small>Demo</small></span>
      </div>
      <div className="logistics-kpis">
        {[["08", "Active Shipments", Truck], ["1,284 km", "Total Distance", Navigation], ["76%", "Avg Utilization", BarChart3], ["92%", "On-Time Rate", CheckCircle2]].map(([value, label, Icon]) => <div className="logistics-kpi" key={label as string}><span><Icon size={17} /></span><strong>{value as string}</strong><small>{label as string}</small></div>)}
      </div>
      <div className="logistics-main-grid">
        <aside className="active-shipments"><div className="logistics-section-heading"><div><p className="eyebrow">LIVE FLEET</p><h2>Active Shipments</h2></div><span className="shipment-count">08</span></div>{shipments.map((shipment) => <button className={`shipment-card ${selected.id === shipment.id ? "selected" : ""}`} key={shipment.id} onClick={() => setSelectedId(shipment.id)}><span className="shipment-card-icon"><Truck size={18} /></span><span className="shipment-card-copy"><b>{shipment.route}</b><small>{shipment.id} · {shipment.cargo}</small><em className={`shipment-status ${shipment.active ? "transit" : shipment.status.includes("Pending") ? "pending" : "scheduled"}`}>{shipment.status}</em></span><span className="shipment-eta">{shipment.eta}</span></button>)}</aside>
        <div className="route-workspace">
          <div className="route-map-card"><div className="route-map-heading"><div><p className="eyebrow">SELECTED ROUTE · {selected.id}</p><h2>Route Map</h2></div><button className="optimize-route" onClick={optimize} disabled={optimizing}>{optimizing ? <><CircleDot className="spin" size={15} /> Optimizing...</> : <><Sparkles size={15} /> Optimize Route</>}</button></div><div className="route-visual"><svg viewBox="0 0 900 280" role="img" aria-label="Route from farm to buyer"><path className="route-line route-complete" d="M90 180 C190 55 260 55 350 155" /><path className="route-line route-active" d="M350 155 C465 250 555 240 650 125" /><path className="route-line route-pending" d="M650 125 C730 55 780 72 830 105" /><g className="route-point complete" transform="translate(90 180)"><circle r="24" /><MapPin size={17} /></g><g className="route-point complete" transform="translate(350 155)"><circle r="24" /><Boxes size={17} /></g><g className="route-point active" transform="translate(650 125)"><circle r="24" /><Navigation size={17} /></g><g className="route-point pending" transform="translate(830 105)"><circle r="24" /><Users size={17} /></g><g className="animated-truck"><rect x="0" y="0" width="32" height="20" rx="5" /><Truck size={16} /></g></svg><div className="route-labels"><span><b>Farm</b><small>Nashik farm cluster</small></span><span><b>Collection Point</b><small>Pune hub</small></span><span><b>Agri Hub</b><small>Vashi market</small></span><span><b>Buyer</b><small>Mumbai Fresh Foods</small></span></div></div><div className="route-legend"><span><i className="complete-dot" /> Completed</span><span><i className="active-dot" /> In transit</span><span><i className="pending-dot" /> Pending</span></div></div>
          <div className="logistics-detail-grid"><div className="shipment-timeline logistics-card"><div className="logistics-section-heading"><div><p className="eyebrow">LIVE UPDATES</p><h2>Shipment Timeline</h2></div><span className="live-indicator" /></div>{[["Nashik farm cluster", "08:10 AM", "Fresh tomatoes · 2,400 kg", "Departed"], ["Pune collection point", "10:35 AM", "Quality check completed", "Completed"], ["Vashi agri hub", "02:20 PM", "Route handoff · 184 km", "In transit"], ["Mumbai buyer", "ETA 06:00 PM", "Delivery confirmation pending", "Upcoming"]].map(([location, time, cargo, status], index) => <div className="timeline-row" key={location}><span className={`timeline-marker ${index < 2 ? "done" : index === 2 ? "current" : ""}`}>{index < 2 ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}</span><div><b>{location}</b><small>{cargo}</small></div><span className="timeline-time"><strong>{time}</strong><em>{status}</em></span></div>)}</div><div className="shipment-details logistics-card"><div className="logistics-section-heading"><div><p className="eyebrow">SHIPMENT DETAILS</p><h2>{selected.id}</h2></div><Truck size={20} /></div><div className="detail-fields"><span>Vehicle<strong>Volvo FH · MH 12 AB 4088</strong></span><span>Driver<strong>Ramesh Patil</strong></span><span>Distance<strong>{selected.distance}</strong></span><span>Duration<strong>{selected.duration}</strong></span><span>Transport cost<strong>{selected.cost}</strong></span></div><div className="utilization"><div><span>Vehicle utilization</span><b>{selected.utilization}%</b></div><i><em style={{ width: `${selected.utilization}%` }} /></i></div></div></div>
          <div className="ai-results"><Sparkles size={20} /><div><p className="eyebrow">AI ROUTE OPTIMIZATION RESULTS</p><h2>A more efficient route is ready.</h2><span>Using the Pune handoff reduces distance, time, and fuel usage without changing the delivery window.</span></div><div className="ai-savings"><b>38 km</b><small>distance saved</small><b>42 min</b><small>time saved</small><b>₹1,240</b><small>cost saved</small></div></div>
        </div>
      </div>
      <footer className="logistics-footer"><span>© 2026 KisanBazaar Logistics</span><span><ShieldCheck size={14} /> Secure route monitoring · Last synced just now</span></footer>
    </section>
  );
}

function PortalPage({ role }: { role: string }) {
  return role === "Farmer" ? (
    <FarmerDashboard />
  ) : (
    <DashboardPortal role={role as "Buyer" | "Admin"} />
  );
}

function OutsideClickDismissal() {
  const location = useLocation();
  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!target.closest(".feature-nav")) {
        document
          .querySelectorAll<HTMLDetailsElement>(".feature-nav[open]")
          .forEach((menu) => {
            menu.open = false;
          });
      }
      if (!target.closest(".nav-links") && !target.closest(".menu-button")) {
        const menuButton =
          document.querySelector<HTMLButtonElement>(".menu-button");
        const nav = document.querySelector(".nav-links.open");
        if (nav && menuButton) menuButton.click();
      }
    };
    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);
  return location.pathname === "/" ? <LandingMotion /> : null;
}

function SessionProfile() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    void authService.getCurrentUser().then((user) => {
      if (user) setSession(user);
      else navigate("/login", { replace: true });
    });
  }, [navigate]);
  if (!session)
    return <div className="loading-state">Checking your JWT session...</div>;
  return (
    <ProfileAccount
      session={session}
      onLogout={() => {
        void authService.logout();
        navigate("/login", { replace: true });
      }}
    />
  );
}

function App() {
  void Shell;
  void LegacyMarketplace;
  return (
    <BrowserRouter>
      <ApiRequestLoader />
      <PortalShell />
      <OutsideClickDismissal />
    </BrowserRouter>
  );
}

function ApiRequestLoader() {
  const isLoading = useSyncExternalStore(
    subscribeToApiLoading,
    getApiLoadingSnapshot,
    () => false,
  );
  return isLoading ? <div className="api-request-loader" role="status" aria-label="Loading" /> : null;
}
export default App;
