type WallpaperGridProps = {
  width: number;
  height: number;
  totalDays: number;
  daysPassed: number;
  headerText: string;
  subtitleText?: string;
  daysLeft: number;
  percentage: number;
  accentColor: string;
};

export function WallpaperGrid({
  width,
  height,
  totalDays,
  daysPassed,
  headerText,
  subtitleText,
  daysLeft,
  percentage,
  accentColor,
}: WallpaperGridProps) {
  const cols = 15;
  const rows = Math.ceil(totalDays / cols);

  const horizontalPadding = width * 0.12;
  const topPadding = height * 0.26;
  const bottomPadding = height * 0.08;
  const availableWidth = width - horizontalPadding * 2;
  const availableHeight = height - topPadding - bottomPadding;

  const dotSpacing = Math.min(availableWidth / cols, availableHeight / rows);
  const dotSize = dotSpacing * 0.65;

  const gridWidth = cols * dotSpacing;
  const gridHeight = rows * dotSpacing;

  const startX = (width - gridWidth) / 2 + dotSpacing / 2;
  const startY = topPadding + (availableHeight - gridHeight) / 2;

  const fontSize = Math.floor(width * 0.032);
  const headerFontSize = Math.floor(width * 0.022);
  const subtitleFontSize = Math.floor(width * 0.018);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#121214",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: startY - dotSpacing * (subtitleText ? 1.8 : 1.2),
          left: startX - dotSpacing / 2,
          width: gridWidth,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            color: accentColor,
            fontSize: headerFontSize,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: gridWidth,
          }}
        >
          {headerText}
        </span>
        {subtitleText ? (
          <span
            style={{
              color: "#6b7280",
              fontSize: subtitleFontSize,
              marginTop: 6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: gridWidth,
            }}
          >
            {subtitleText}
          </span>
        ) : null}
      </div>

      {Array.from({ length: totalDays }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * dotSpacing;
        const y = startY + row * dotSpacing;

        const isToday = daysPassed > 0 && i === daysPassed - 1;
        const isPassed = daysPassed > 0 && i < daysPassed - 1;

        let bgColor = "#3a3a3c";
        if (isToday) {
          bgColor = accentColor;
        } else if (isPassed) {
          bgColor = "#ffffff";
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - dotSize / 2,
              top: y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: bgColor,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: height * 0.06,
          left: 0,
          width,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ color: accentColor, fontSize }}>
          {daysLeft}d left
        </span>
        <span
          style={{
            color: "#6b7280",
            fontSize,
            marginLeft: 12,
            marginRight: 12,
          }}
        >
          ·
        </span>
        <span style={{ color: "#6b7280", fontSize }}>{percentage}%</span>
      </div>
    </div>
  );
}
