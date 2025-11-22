export default function AppLogoIcon({ className }: { className: string }) {
    return (
        <img
            src="/app-logo.png"
            alt=""
            className={'rounded-full ' + className}
        />
    );
}
