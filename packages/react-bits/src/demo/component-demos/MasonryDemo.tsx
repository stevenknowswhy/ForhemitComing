import React from 'react';
import { Masonry } from '../../components/layout/Masonry';
import { Hero } from '../../components/sections/Hero';
import { Heading } from '../../components/typography/Heading';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// Individual demo sections as separate components
const MasonryGridDemo: React.FC = () => {
  const items = [
    { id: '1', content: <div className="demo-card" style={{ height: '180px' }}>Card 1 - Short</div>, span: 1 },
    { id: '2', content: <div className="demo-card" style={{ height: '250px' }}>Card 2 - Tall</div>, span: 1 },
    { id: '3', content: <div className="demo-card" style={{ height: '200px' }}>Card 3 - Medium</div>, span: 1 },
    { id: '4', content: <div className="demo-card" style={{ height: '220px' }}>Card 4 - Medium</div>, span: 1 },
    { id: '5', content: <div className="demo-card" style={{ height: '160px' }}>Card 5 - Short</div>, span: 1 },
    { id: '6', content: <div className="demo-card" style={{ height: '280px' }}>Card 6 - Extra Tall</div>, span: 1 },
  ];

  return (
    <div className="demo-section">
      <h3>Masonry Grid (3 columns)</h3>
      <p>A 3-column masonry grid with varying heights, automatically balancing columns.</p>
      <Masonry columns={3} gap="1rem">
        {items.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </Masonry>
    </div>
  );
};

const MasonryColumnsDemo: React.FC = () => {
  const items = [
    { id: '1', content: <div className="demo-card" style={{ height: '150px' }}>Short Card</div> },
    { id: '2', content: <div className="demo-card" style={{ height: '300px' }}>Very Tall Card</div> },
    { id: '3', content: <div className="demo-card" style={{ height: '200px' }}>Medium Card</div> },
    { id: '4', content: <div className="demo-card" style={{ height: '250px' }}>Tall Card</div> },
    { id: '5', content: <div className="demo-card" style={{ height: '180px' }}>Short Card</div> },
    { id: '6', content: <div className="demo-card" style={{ height: '220px' }}>Medium Card</div> },
    { id: '7', content: <div className="demo-card" style={{ height: '190px' }}>Short Card</div> },
    { id: '8', content: <div className="demo-card" style={{ height: '270px' }}>Tall Card</div> },
  ];

  return (
    <div className="demo-section">
      <h3>4-Column Masonry</h3>
      <p>Higher density layout with 4 columns for image galleries or portfolio displays.</p>
      <Masonry columns={4} gap="0.75rem">
        {items.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </Masonry>
    </div>
  );
};

const MasonryWithImagesDemo: React.FC = () => {
  const images = [
    { id: '1', src: 'https://picsum.photos/400/300?random=1', alt: 'Random 1', height: 300 },
    { id: '2', src: 'https://picsum.photos/400/400?random=2', alt: 'Random 2', height: 400 },
    { id: '3', src: 'https://picsum.photos/400/250?random=3', alt: 'Random 3', height: 250 },
    { id: '4', src: 'https://picsum.photos/400/350?random=4', alt: 'Random 4', height: 350 },
    { id: '5', src: 'https://picsum.photos/400/280?random=5', alt: 'Random 5', height: 280 },
    { id: '6', src: 'https://picsum.photos/400/320?random=6', alt: 'Random 6', height: 320 },
  ];

  return (
    <div className="demo-section">
      <h3>Masonry Image Gallery</h3>
      <p>Perfect for image galleries where images have different aspect ratios.</p>
      <Masonry columns={3} gap="1rem">
        {images.map((img) => (
          <div key={img.id} className="demo-image-card">
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '100%', height: `${img.height}px`, objectFit: 'cover' }}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export const MasonryDemo: React.FC = () => {
  return (
    <div className="masonry-demo">
      <Section>
        <Heading level={2}>Masonry Component Demos</Heading>
        <p className="demo-description">
          The Masonry component creates Pinterest-style layouts with items of varying heights,
          automatically distributing them across columns for optimal space usage.
        </p>

        <MasonryGridDemo />
        <MasonryColumnsDemo />
        <MasonryWithImagesDemo />

        <div className="demo-props">
          <Heading level={3}>Component Props</Heading>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>columns</code></td>
                <td><code>number</code></td>
                <td><code>3</code></td>
                <td>Number of columns in the masonry grid</td>
              </tr>
              <tr>
                <td><code>gap</code></td>
                <td><code>string</code></td>
                <td><code>"1rem"</code></td>
                <td>Gap between items (CSS value)</td>
              </tr>
              <tr>
                <td><code>children</code></td>
                <td><code>ReactNode</code></td>
                <td>-</td>
                <td>Masonry items to layout</td>
              </tr>
              <tr>
                <td><code>className</code></td>
                <td><code>string</code></td>
                <td><code>""</code></td>
                <td>Additional CSS class names</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
};

export default MasonryDemo;
