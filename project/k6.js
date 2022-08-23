import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  vus: 2000,
  duration: "200s",
};

export default function () {
  const res = http.get("http://35.186.244.212/product");
  check(res, {
    "status was 200": (r) => r.status == 200,
    "transaction time OK": (r) => r.timings.duration < 500,
  });
  sleep(1);
}

