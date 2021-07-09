import React from 'react';
import {Carousel} from 'react-bootstrap';
import c1 from './c1.jpg';
import c2 from './c2.jpg';
import c3 from './c3.jpg';

const ImgCarousel = () => {
    return (
        <Carousel fade>
            <Carousel.Item>
                <img
                    className="d-block"
                    src={c1}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h2>Learn</h2>
                    <p>Learn the ins and outs of the stock market by searching for different stocks available on the market.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block"
                        src={c2}
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h2>Manage</h2>
                        <p>Use your account balance to buy and sell as many shares as you like. </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block"
                        src={c3}
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h2>Improve</h2>
                        <p>Track your portfolio balance through time to see how much you can earn!</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
    )
}

export default ImgCarousel;