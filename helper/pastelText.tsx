function PastelText({ text }: { text: string }) {
  const colors = [
    "text-pink-300",
    "text-purple-300",
    "text-blue-300",
    "text-green-300",
    "text-yellow-300",
    "text-orange-300",
  ];

  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={colors[i % colors.length]}
          style={{
            textShadow: `
              -4px 0 white,
              4px 0 white,
              0 -4px white,
              0 4px white,
              -4px -4px white,
              4px -4px white,
              -4px 4px white,
              4px 4px white
            `,
            letterSpacing: "0.1em",
          }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default PastelText;
