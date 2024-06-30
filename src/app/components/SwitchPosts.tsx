import { useState } from "react";
import Card from "./Card";
import ContentSwitch from "./ContentSwitch";

const SwitchPosts = () => {
  const [isTrending, setIsTrending] = useState(true);

  const handleSwitch = (value) => {
    setIsTrending(value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ContentSwitch onSwitch={handleSwitch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-opacity duration-500">
        {isTrending ? (
          <>
            <Card
              key="trending"
              imageUrl="https://cdn.midjourney.com/15608ebc-422c-44c1-bdcc-69e50def6bf2/0_2.webp"
              title="Digital Revolution: Navigating the Tech Landscape"
              category="Technology"
            />
            {/* Add more trending cards here */}
          </>
        ) : (
          <>
            <Card
              key="latest"
              imageUrl="https://cdn.midjourney.com/cca86dda-481d-4b3b-900c-f95912cfce39/0_3.webp"
              title="Exploring China's Cultural Mosaic: A Journey Through Time"
              category="Culture"
            />
            {/* Add more latest cards here */}
          </>
        )}
      </div>
    </div>
  );
};

export default SwitchPosts;
