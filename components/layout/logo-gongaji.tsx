const GoNgajiLogo = ({ colorScheme }: { colorScheme: string }) => {
    const isDark = colorScheme !== 'light';
    const mainColor = isDark ? '#FFFFFF' : '#613992';
    const accentColor = isDark ? '#A580D1' : '#8E64C5'; // Warna sekunder untuk dimensi

    return (
        <svg
            width="45"
            height="45"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Lingkaran Luar dengan Gradasi Halus (Opsional stroke) */}
            <circle cx="50" cy="50" r="46" stroke={mainColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />

            {/* Simbol Buku Terbuka / Mushaf (Modern Style) */}
            <path
                d="M50 75V35M50 75C50 75 40 65 20 65V25C40 25 50 35 50 35M50 75C50 75 60 65 80 65V25C60 25 50 35 50 35"
                stroke={mainColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Aksen Lengkungan Atas (Menyerupai Kubah atau Huruf G terbalik) */}
            <path
                d="M30 20C40 12 60 12 70 20"
                stroke={accentColor}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
            />

            {/* Titik Inti / Fokus */}
            <circle cx="50" cy="45" r="3" fill={accentColor} />

            {/* Garis Dasar / Podium */}
            <path
                d="M35 85H65"
                stroke={mainColor}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
};

export default GoNgajiLogo;
