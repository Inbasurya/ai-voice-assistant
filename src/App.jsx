import React, { useState, useEffect } from 'react';
import './styles.css';
import image_ceramic from "./assets/image_ceramic.png";
import imageexeterior from "./assets/image_exterior.png";
import imageinterior from "./assets/image_interior.png";
import imagepaint from "./assets/image_paint.png";
import imagepremium from "./assets/image_premium.png";
import { Room, RoomEvent } from "livekit-client";

const App = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://ai-voice-assistant-1-mkkg.onrender.com/')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setIsLoading(false);
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const startVoiceAssistant = async () => {
    if (isVoiceActive) return;

    try {
      console.log("Starting voice assistant...");
      setIsVoiceActive(true); 

      const response = await fetch("https://ai-voice-assistant-1-mkkg.onrender.com/getToken");
      const data = await response.json();
      console.log("Token received:", data);
                                         
      const audioElements = new Map();

      const room = new Room({
        webAudioMix: true,
        publishDefaults: { audioBitrate: 32000 },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        console.log(`Track subscribed: ${track.kind} from ${participant.identity}`);
        if (track.kind === "audio") {
          const el = track.attach();
          document.body.appendChild(el);
          audioElements.set(track.sid, el);
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        const el = audioElements.get(track.sid);
        if (el) { el.remove(); audioElements.delete(track.sid); }
      });

      
      room.on(RoomEvent.Disconnected, () => {
        console.log("Room session disconnected");
        setIsVoiceActive(false);
      });

      await room.connect(data.url, data.token);
      console.log("Connected to LiveKit room");

      await room.localParticipant.setMicrophoneEnabled(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      console.log("Microphone enabled");

    } catch(error) {
      console.error("LiveKit connection error:", error);
      setIsVoiceActive(false); 
    }
  };

  return (
    <>
      <header id="Navbar">
        <nav>
          <h1 id="nav">REACT CAR WASH & DETAILING</h1>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
      <i className={`fa-solid ${menuOpen ? 'fa-x' : 'fa-bars'}`}></i>
    </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
      <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
      <li><a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a></li>
      <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
      <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
    </ul>
        </nav>
      </header>
      
      <div className="container">
        {message && (
          <div style={{ textAlign: 'center', color: 'green', marginTop: '20px' }}>
            <h3>Backend Message: {message}</h3>
          </div>
        )}

        <div id="home">
          <h1 id="Heading">REACT CAR WASH & DETAILING</h1>
          <p className="Paragraph">
            Welcome to REACT CAR WASH! We are dedicated to providing your vehicle with premium treatment using advanced eco-friendly solutions and cutting-edge water filtration machinery. Whether you need a quick automated express rinse or a comprehensive structural detailing service, our highly skilled technician crews ensure an absolute showroom finish. Founded on meticulous standards, we strictly operate in alignment with global automotive surface protection safety standard guides. Thank you for choosing us to preserve your ride's shine!  Welcome to REACT CAR WASH! We are delighted to have you here. Our facility offers a wide variety of premium vehicle cleaning and detailing services made from the highest quality eco-friendly products and advanced water-filtration machinery. Whether you're in the mood for a quick automated express rinse or a comprehensive structural detailing treatment, we have options to suit every vehicle size and condition. Our friendly staff is here to ensure you have a wonderful service experience. Our workflow concept was drawn from elite automotive detailing centers, with the clear idea to create an authentic surface-safe care workshop specialized in paint correction, advanced tandoor-level heat curing ceramic shields, interior stain extraction, and lip-smacking deep gloss profiles with great care, grand treatment bays, and unmatched services to provide you a memorable customer experience. Complete multi-stage engine bay de-greasing and alloy wheel rim restorations are the unique attractions of our custom service packages. The concept of REACT CAR WASH was established in 2011 with a strong focus and commitment towards quality, exceptional turnaround speed, and warm hospitality, employing a team of highly skilled & experienced detailing technicians and supported by a strong quality control management team across different service levels to ensure every vehicle meets the highest standards. With due emphasis laid on quality, scratch-free safety & operational hygiene, Copper Detailing Hub is committed to Paint Safety Standards and strictly implements international ISO surface safety rules across the chain of facilities and is periodically audited. Thank you for choosing REACT CAR WASH, and we look forward to treating your vehicle!
          </p>
        </div>

        <h3 className="H">We offer The following services</h3>
        <div className="Cuisine">
          <h3 className="H3">Premium Tier Package</h3>
          <img src={imagepremium} alt="Premium Tier Package" />
          <p className="image-description">
            Our premium tier packages are designed to provide the ultimate car care experience. Each package includes a comprehensive range of services tailored to meet the specific needs of your vehicle. From our Express Wash, which offers a quick and efficient cleaning, to our Deluxe Detail, which provides an in-depth cleaning and protection for your car's exterior and interior, we have options to suit every vehicle and budget. Our Platinum Package includes everything in the Deluxe Detail plus additional services such as paint correction and ceramic coating for maximum protection. For those seeking the best of the best, our Ultimate Package offers a complete transformation with all the services included in the Platinum Package along with engine bay detailing and wheel restoration. Each package is designed to ensure your vehicle receives the highest level of care and attention to detail, leaving it looking its absolute best.
          </p>

          <h3 className="H3">Express Exterior Wash</h3>
          <img src={imageexeterior} alt="Express Exterior Wash" />
          <p className="image-description">
             Authentic exterior care packages with a rigid focus on premium products and traditional paint-safe methods. Indulge in the heartwarming, timeless deep gloss profiles of a perfectly cleaned vehicle. Our exterior wash menu celebrates mechanical simplicity and high quality, featuring specialized, high-foaming pH-neutral shampoos, slow-emulsifying thick active foam curtains, and pure, vibrant clean water rinses using reverse-osmosis filtration systems. From comforting maintenance washes to high-pressure environmental grime removal, each cleaning step is crafted to bring the authentic spirit of professional automotive garage care directly to your clear coat. Experience a refreshing transformation where every single panel feels like a celebration of absolute clarity and shine.
          </p>

          <h3 className="H3">Interior Restoration</h3>
          <img src={imageinterior} alt="Interior Restoration" />
          <p className="image-description">
            Embark on a sensory journey through a thoroughly restored, fresh, and pristine cabin environment. Our interior detailing service is a true masterpiece of complex fiber scrubbing and aromatic deep sanitization herbs, meticulously balanced to eliminate deep-seated floor dust and odors in every single corner. We offer a true symphony of freshness, ranging from heavy-duty anti-bacterial steam cleaning extraction processes and premium, non-greasy dashboard conditioning creams to perfectly detailed air vents and leather textures. Each deep cleaning cycle is a tribute to premium automotive preservation heritage, promising an explosive and fresh driving environment.
          </p>

          <h3 className="H3">Paint Correction & Polish</h3>
          <img src={imagepaint} alt="Paint Correction & Polish" />
          <p className="image-description">
            Taste the vibrant, reflective energy of factory-grade clear coat correction. Our mechanical polishing menu is a bold explosion of dynamic paint transformations, packed with deep mirror levels, intense heat protection, and sleek smoothness. We use traditional compounding recipes focusing on safe micro-abrasive polishes, premium wool pad variations, dual-action orbital machine buffers, and authentic premium finishing oils. From minor superficial swirl removal to complex multi-stage clear coat oxidation leveling, each structural polishing step delivers an exciting and satisfying return to your vehicle's original rich paint depth and color culture.
          </p>
            <h3 className="H3">Ceramic Shield Protection</h3>
          <img src={image_ceramic} alt="Ceramic Shield" />
          <p className="image-description">
            Discover the sophisticated balance of protective longevity and sleek hydrophobic gloss metrics that defines authentic nanoscale crystal shielding. Our ceramic coating service showcases masterful liquid quartz application techniques, delivering surface finishes bursting with protective resilience, alongside delicate, handcrafted final inspections. From long-lasting chemical cross-linking shields to highly slick top coats, we use advanced silica-infused ingredients and traditional layered curation methods to offer an exterior shield that is both deeply satisfying and artfully balanced to block incoming UV radiation, bird droppings, and environmental acid rain damage.
          </p>
        </div>

        <div>
          <h3 className="H3" id="about">our story</h3>
          <p className="Paragraph">
             Founded in 2010, REACT CAR WASH has been serving the community with dedicated and premium automotive care solutions. Our passion for paint preservation and deep commitment to absolute quality have made us a beloved destination for car lovers and daily drivers alike. The original idea was to create a unique detailing center with specialized authentic, high-end paint restoration, premium interior vacuum extraction, and state-of-the-art ceramic shield setups with great turnaround speed, grand treatment bays, and unmatched services to provide you a memorable service experience. We at Copper Detailing Hub started our journey in 2008 and the core structural concept of our 'premium car wash facility' was established in 2011. We are proudly providing the best automotive care and washing systems in town, featuring multiple flexible packages to choose from across various vehicle treatment tiers!
          </p>
        </div>
        

        <div>
          <h4 className="H3">Our Service Menu</h4>
          <ul className="Menu" id="menu">
            <li>Basic Wash - 650 </li>
            <li>Exterior Polish - 1450 </li>
            <li>Interior Vacuum - 350 </li>
            <li>Full Detailing - 2100 </li>
            <li>Ceramic Coating - 3500 </li>
            <li>Engine Bay Cleaning - 500 </li>
            <li>Windshield Treatment - 580 </li>
            <li>Wheel Rim Restoration - 1400 </li>
            <li>Odor Eliminator - 1200 </li>
            <li>Leather Conditioning - 1150 </li>
          </ul>
        </div>

        <div>
          <h3 className="H3">Our service locations</h3>
          <p className="Paragraph">
           We are proud to serve your vehicles in multiple fully equipped service facilities located strategically across the city. Our workshop bays can be found in downtown, uptown, and busy suburban commerce areas, making it incredibly convenient for you to drop off your car no matter where you are traveling. We also offer professional mobile detailing van units to ensure that you can enjoy our maintenance work right from the comfort of your home garage or driveway. Check out our web contact points below for specific route mapping addresses and operational bay queue updates!
          </p>
        </div>

        <ul className="service-locations">
          <li>1. Chennai-123 Main St</li>
          <li>2. Bangalore-456 Ave</li>
          <li>3. Hyderabad-789  Rd</li>
        </ul>

        <div>
          <h3 className="H3">Contact Us</h3>
          <p className="Paragraph">For any commercial fleet accounts, custom service quotes, or reservation inquiries, please feel free to contact us at:</p>
        </div>

        <div className="contact" id="contact">
          <a href="tel:9129469789">
            📞 Phone: 912-946-9789
          </a>
          <a href="mailto:info@reactcarwash.com">
            ✉️ Email: info@reactcarwash.com
          </a>
          <a href="https://maps.google.com/?q=123+Main+St,+Chennai,+State+12345" target="_blank" rel="noopener noreferrer">
            📍 Address: KNK Main St, Chennai City, Tamil Nadu 600005
          </a>
        </div>

        {}
        <button 
          className="phone-icon" 
          onClick={startVoiceAssistant}
          disabled={isVoiceActive}
          style={{ 
            backgroundColor: isVoiceActive ? 'gray' : '#25D366',
            cursor: isVoiceActive ? 'not-allowed' : 'pointer'
          }}
        >
          <i className={`fa-solid ${isVoiceActive ? 'fa-microphone' : 'fa-phone'}`}></i>
        </button>
      </div>
    </>
  );
};

export default App;