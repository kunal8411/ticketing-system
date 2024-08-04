import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we a re on the server

    return axios.create({
      // servicName.Namespace.srv.contoller.local
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // we are on the browser

    // getInitialProps called from the CLIENT SIDE , when switching from one page to another
    return axios.create({
      baseURL: "/",
    });
  }
};