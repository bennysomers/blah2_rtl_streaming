# blah2

A real-time radar which can support various SDR platforms. See a live instance at [http://radar4.30hours.dev](http://radar4.30hours.dev).

![blah2 example display](./example.png "blah2")

## Features

- Support for the [SDRplay RSPDuo](https://www.sdrplay.com/rspduo/) and [USRP](https://www.ettus.com/products/) (only tested on B210).
- 2 channel processing for a reference and surveillance signal.
- Designed as a passive radar, but can also work as an active radar.
- Outputs delay-Doppler maps to a web front-end.
- Record raw IQ data by pressing spacebar on the web front-end.
- Saves delay-Doppler maps in a *json* array.

## Services

The build environment consists of a docker-compose.yml file running the following services;

- The radar processor responsible for IQ capture and processing.
- The API middleware responsible for reading TCP ports for delay-Doppler map data, and exposing this on a REST API.
- The web front-end displaying processed radar data.

## Usage

- Install docker and docker-compose on the host machine.
- Clone this repository to some directory.
- Install SDRplay API to run service on host.
- Edit the config.yml for desired processing parameters.
- Run the docker-compose command.

```bash
sudo git clone http://github.com/30hours/blah2 /opt/blah2
cd /opt/blah2
vim config/config.yml
./lib/sdrplay-3.12.1/SDRplay_RSP_API-Linux-3.12.1.run --tar -xvf -C ./lib/sdrplay-3.12.1
./lib/sdrplay-3.12.1/install_lib.sh
sudo docker network create blah2
sudo systemctl enable docker
sudo docker compose up -d
```

The radar processing output is available on [http://localhost:49152](http://localhost:49152).

## Documentation

- See `doxygen` pages hosted at [http://doc.30hours.dev/blah2](http://doc.30hours.dev/blah2).

## Future Work

- Add a tracker in delay-Doppler space.
- Add ADS-B overlay on the delay-Doppler map.
- Support for the HackRF and RTL-SDR using a front-end mixer to sample 2 RF channels in 1 stream.
- Support for using 2 HackRF boards with clock synchronisation.
- Add automated Docker image builds on GHCR.
- Add [SoapySDR](https://github.com/pothosware/SoapySDR) support for the [C++ API](https://github.com/pothosware/SoapySDR/wiki/Cpp_API_Example) to include a wide range of SDR platforms.

## FAQ

- If the SDRplay RSPduo does not capture data, restart the API service (on the host) using `sudo systemctl restart sdrplay.api`.

## Contributing

Pull requests are welcome - especially for adding support for a new SDR.

- Currently have an issue where the USRP B210 is timing out after 5-10 mins and crashes the code. Convinced it's an issue with my usage of the API - email me for more info.

## License

[MIT](https://choosealicense.com/licenses/mit/)
