import { LoaderCircle } from "lucide-react";

export const LoadingScreen = ({message}) => {
  return (
    <div className="h-full w-full text-accent-foreground flex flex-col justify-center items-center">
        <LoaderCircle className="animate-spin repeat-infinite" size={64}/>
        {message}
    </div>
  );
}
