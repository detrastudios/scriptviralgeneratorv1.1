export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-2 md:h-24">
        <p className="text-xs font-semibold text-muted-foreground">Visig V 1.1</p>
        <p className="text-balance text-center text-xs leading-loose text-muted-foreground">
          © 2025{' '}
          <a
            href="https://www.instagram.com/detrastudios"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Detra Studios
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
