import { Link } from "react-router-dom";
import NotFound from '../../assets/notfound.png'
export default function PageNotFound() {
          return (
                    <div className="flex justify-center items-center text-3xl mt-10">
                              <figure className="flex flex-col items-center gap-y-2">
                                        <figcaption className="text-5xl font-semibold">404 Page not found!</figcaption>
                                        <img src={NotFound} alt="Page not found" />
                                        <p>Oh my god your lost, <Link className="text-blue-500 underline" to={"/"}>Click me </Link> to go back</p>
                              </figure>
                    </div>
          )
}
