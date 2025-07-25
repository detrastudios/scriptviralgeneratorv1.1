import * as React from 'react';

export const VisigLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 358 102"
    aria-label="VISIG Logo"
    {...props}
  >
    <path
      d="M109 101V1H82l-51 83V1H1v100h27l51-84v84h29Z"
      className="fill-primary"
    />
    <path
      d="m109 44 23-43h32l-34 62 35 39h-32l-24-28-11 11v17h-22V1h32v43Z"
      className="fill-primary"
    />
    <path
      d="m118.5 24 9-16.5 4.5 9-9 4.5-4.5 3Zm-15-9.5 7.5-14 4 7-7.5 3.5-4 3.5Z"
      className="fill-accent"
    />
    <path
      d="M245 101a51 51 0 0 1-51-51V1h31v49a20.5 20.5 0 0 0 41 0V1h31v99c0 .33-.02.66-.04 1h-1.46A51.01 51.01 0 0 1 245 101Zm82-100v100h31V1h-31Z"
      className="fill-primary"
    />
    <path
      d="M285.5 51a20.5 20.5 0 0 0-20.5-20.5v41a20.5 20.5 0 0 0 20.5-20.5Z"
      className="fill-primary"
    />
  </svg>
);
