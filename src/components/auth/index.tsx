import { useTheme } from "@/contexts/ThemeProvider";
import Signin from "./Signin";
import Signup from "./Signup";

export default function Auth() {
  const { theme } = useTheme();
  return (
    <div className="w-full bg-white md:max-w-lg md:ms-auto xl:max-w-2xl">
      <div className="relative pt-2">
        <div className="flex w- items-center justify-between md:justify-end lg:pt-4 px-4">
          <svg
            className="md:hidden"
            width="70"
            height="80"
            viewBox="0 0 25 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.9737 3.78723L23.693 3.80068V2.49308C23.693 1.43201 22.8324 0.572021 21.772 0.572021H1.92106C0.859993 0.572021 0 1.43201 0 2.49308V9.53696C0 10.5974 0.859993 11.458 1.92106 11.458H4.46902L4.45557 12.0587H19.2106L19.1971 11.458H21.772C22.8324 11.458 23.693 10.5974 23.693 9.53696V8.21655H25L24.9737 3.78723ZM23.0527 9.53696C23.0527 10.2439 22.4789 10.8177 21.772 10.8177H1.92106C1.21411 10.8177 0.640352 10.2439 0.640352 9.53696V2.49308C0.640352 1.78613 1.21411 1.21237 1.92106 1.21237H21.772C22.4789 1.21237 23.0527 1.78613 23.0527 2.49308V9.53696ZM21.772 1.85273H1.92106C1.56694 1.85273 1.2807 2.13896 1.2807 2.49308V9.53696C1.2807 9.89107 1.56694 10.1773 1.92106 10.1773H21.772C22.1255 10.1773 22.4123 9.89107 22.4123 9.53696V2.49308C22.4123 2.1396 22.1255 1.85273 21.772 1.85273ZM20.6494 3.7629L20.1372 4.24316H18.5805L18.145 3.7629H20.6494ZM20.0622 5.764L20.2864 6.00157L20.0174 6.23914H18.3448L18.1329 6.00157L18.389 5.764H20.0622ZM18.0496 3.84742L18.4844 4.32769L18.3762 5.60839L18.0496 5.90936L17.8831 5.73006L18.0496 3.84742ZM13.8937 3.84742L14.3285 4.32769L14.2203 5.60839L13.8937 5.90936L13.7272 5.73006L13.8937 3.84742ZM15.9044 5.764L16.1292 6.00157L15.8596 6.23914H14.1889L13.9776 6.00157L14.2331 5.764H15.9044ZM7.49533 3.84742L7.93012 4.32769L7.81806 5.60839L7.49469 5.91L7.33011 5.7307L7.49533 3.84742ZM9.50539 5.764L9.73015 6.00157L9.46121 6.23914H7.78797L7.57921 6.00157L7.83471 5.764H9.50539ZM5.93927 3.7629L5.42635 4.24316H3.87029L3.43485 3.7629H5.93927ZM3.33944 3.84742L3.77488 4.32769L3.66218 5.60839L3.3388 5.91L3.17423 5.7307L3.33944 3.84742ZM3.1262 6.27436L3.31831 6.0893L3.59366 6.38962L3.48608 7.67097L2.96227 8.15123L3.1262 6.27436ZM3.04167 8.24024L3.56676 7.75998H5.12026L5.54865 8.24024H3.04167ZM5.64471 8.14995L5.21439 7.67033L5.32197 6.38898L5.64919 6.08866L5.80928 6.27372L5.64471 8.14995ZM5.85666 5.73006L5.66904 5.90936L5.39049 5.60775L5.50255 4.32705L6.02251 3.84678L5.85666 5.73006ZM7.28209 6.27436L7.47419 6.0893L7.74955 6.38962L7.64197 7.67097L7.11816 8.15059L7.28209 6.27436ZM7.19692 8.24024L7.72201 7.75998H9.27615L9.70454 8.24024H7.19692ZM9.80059 8.15059L9.37156 7.67033L9.47978 6.38962L9.807 6.08866L9.96773 6.27372L9.80059 8.15059ZM9.58287 4.24316H8.02682L7.59074 3.7629H10.0945L9.58287 4.24316ZM11.8945 8.24024H11.4143L11.4585 7.75998H11.9387L11.8945 8.24024ZM12.1763 4.98853H11.696L11.7409 4.50827H12.2211L12.1763 4.98853ZM13.5992 8.24024L14.1179 7.75998H15.6739L16.1029 8.24024H13.5992ZM16.199 8.14995L15.7693 7.67033L15.8782 6.38962L16.2054 6.08866L16.3655 6.27372L16.199 8.14995ZM15.9813 4.24316H14.4252L13.9891 3.7629H16.4929L15.9813 4.24316ZM17.7551 8.24024L18.2744 7.75998H19.8304L20.2595 8.24024H17.7551ZM20.3549 8.14995L19.9246 7.67033L20.0321 6.38898L20.3594 6.08866L20.5195 6.27372L20.3549 8.14995ZM20.5675 5.73006L20.3792 5.90936L20.1007 5.60775L20.2134 4.32705L20.7333 3.84678L20.5675 5.73006Z"
              fill={theme !== "dark" ? "#000" : "#fff"}
            />
          </svg>
          <Signin />
        </div>
        <Signup />
      </div>
    </div>
  );
}