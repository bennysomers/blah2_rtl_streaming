FROM ubuntu:22.04 as blah2_env
LABEL maintainer="30hours <nathan@30hours.dev>"

WORKDIR /blah2
ADD lib lib
RUN apt-get update && apt-get install -y software-properties-common \
  && apt-add-repository ppa:ettusresearch/uhd \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y \
  g++ make cmake git curl zip unzip doxygen graphviz \
  libfftw3-dev pkg-config gfortran \
  libuhd-dev=4.6.0.0-0ubuntu1~jammy1 \
  uhd-host=4.6.0.0-0ubuntu1~jammy1 \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# install dependencies from vcpkg
RUN git clone https://github.com/microsoft/vcpkg /opt/vcpkg \
  && /opt/vcpkg/bootstrap-vcpkg.sh
ENV PATH="/opt/vcpkg:${PATH}" VCPKG_ROOT=/opt/vcpkg
RUN cd /blah2/lib && vcpkg integrate install \
  && vcpkg install --clean-after-build

# install SDRplay API
RUN chmod +x /blah2/lib/sdrplay-3.12.1/SDRplay_RSP_API-Linux-3.12.1.run \ 
  && /blah2/lib/sdrplay-3.12.1/SDRplay_RSP_API-Linux-3.12.1.run --tar -xvf -C /blah2/lib/sdrplay-3.12.1 \ 
  && cp /blah2/lib/sdrplay-3.12.1/x86_64/libsdrplay_api.so.3.12  /usr/local/lib/libsdrplay_api.so \ 
  && cp /blah2/lib/sdrplay-3.12.1/x86_64/libsdrplay_api.so.3.12 /usr/local/lib/libsdrplay_api.so.3.12 \ 
  && cp /blah2/lib/sdrplay-3.12.1/inc/* /usr/local/include \ 
  && chmod 644 /usr/local/lib/libsdrplay_api.so /usr/local/lib/libsdrplay_api.so.3.12 \ 
  && ldconfig

# install UHD API
RUN uhd_images_downloader

FROM blah2_env as blah2
LABEL maintainer="30hours <nathan@30hours.dev>"

ADD src src
ADD test test
ADD CMakeLists.txt CMakePresets.json Doxyfile /blah2/
RUN mkdir -p build && cd build && cmake -S . --preset prod-release \
  -DCMAKE_PREFIX_PATH=/blah2/lib/vcpkg_installed/x64-linux/share .. \
  && cd prod-release && make
RUN chmod +x bin/blah2
