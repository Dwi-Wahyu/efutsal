export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src={'/app-logo.png'}
                className="h-[30px] w-[30px] rounded-full"
            />
            {/* <h1 className="text-lg font-semibold">E-Futsal</h1> */}
        </div>
    );
}
