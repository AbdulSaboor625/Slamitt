import { Button, Carousel, Image } from "antd";
import { testimonials } from "../../utility/config";

const TestimonialCarousel = ({ setShowLogin }) => (
  <>
    <Button
      className="laptop:hidden mobile:visible buttonGetStarted visibleMobile"
      onClick={() => setShowLogin(true)}
    >
      Get Started
    </Button>
    <Carousel autoplay dotPosition="bottom">
      {testimonials.map((testimonial, i) => (
        <div key={i} className="testimonialsParent">
          <Image
            preview={false}
            src={testimonial.img}
            layout="responsive"
            alt="img"
            style={{ height: "100vh" }}
          />
          <div className="testimonialContent">
            <blockquote>
              <p>{testimonial.review}</p>
              <cite>
                <strong>{testimonial.name}</strong> {testimonial.designation}
              </cite>
            </blockquote>
          </div>
        </div>
      ))}
    </Carousel>
  </>
);

export default TestimonialCarousel;
