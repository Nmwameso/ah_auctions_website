"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useVehicleStore } from "../../../../stores/useVehicleStore";
import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Spinner,
  Icon,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import {
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaRoad,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = String(params.vehicle_id);

  const { vehicle, loading, error, fetchVehicleById, clearVehicle } = useVehicleStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Zoom hover
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Thumbnail refs for auto-scrolling
  const modalThumbnailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const inlineThumbnailsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!vehicle || vehicle.vehicle_id !== vehicleId) {
      fetchVehicleById(vehicleId);
    }
  }, [vehicleId, fetchVehicleById, vehicle]);

  useEffect(() => {
    return () => clearVehicle();
  }, [clearVehicle]);

  useEffect(() => {
    if (vehicle?.photos && vehicle.photos.length > 0) {
      setSelectedPhoto(vehicle.photos[0].image_url);
      setSelectedIndex(0);
      setImageLoading(true);
    }
  }, [vehicle]);

  const handleImageLoad = () => setImageLoading(false);

  const handleThumbnailClick = (photoUrl: string, idx: number) => {
    if (photoUrl !== selectedPhoto) {
      setSelectedPhoto(photoUrl);
      setSelectedIndex(idx);
      setImageLoading(true);
      scrollToThumbnail(idx);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const scrollToThumbnail = (idx: number) => {
    modalThumbnailsRef.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center" });
    inlineThumbnailsRef.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center" });
  };

  const prevPhoto = () => {
    if (!vehicle?.photos) return;
    const newIndex = (selectedIndex - 1 + vehicle.photos.length) % vehicle.photos.length;
    setSelectedPhoto(vehicle.photos[newIndex].image_url);
    setSelectedIndex(newIndex);
    setImageLoading(true);
    scrollToThumbnail(newIndex);
  };

  const nextPhoto = () => {
    if (!vehicle?.photos) return;
    const newIndex = (selectedIndex + 1) % vehicle.photos.length;
    setSelectedPhoto(vehicle.photos[newIndex].image_url);
    setSelectedIndex(newIndex);
    setImageLoading(true);
    scrollToThumbnail(newIndex);
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Breadcrumb */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
        <Box maxW="7xl" mx="auto" px={4}>
          <Heading size="md" mb={2}>Cars</Heading>
          <HStack spacing={2} fontSize="sm" color="gray.600">
            <Link href="/">Home</Link>
            <Text>/</Text>
            <Link href="/vehicles">Vehicles</Link>
            <Text>/</Text>
            <Text fontWeight="bold" color="gray.800">{vehicle?.make} {vehicle?.model}</Text>
          </HStack>
        </Box>
      </Box>

      {/* Main Section */}
      <Box maxW="7xl" mx="auto" px={4} py={10}>
        <Flex direction={{ base: "column", xl: "row" }} gap={8}>
          {/* Gallery Column */}
          <Box flex="0 0 66.666%" maxW={{ xl: "66.666%" }}>
            {loading && (
              <Flex justify="center" py={10}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
              </Flex>
            )}

            {!loading && error && (
              <Box bg="red.50" color="red.600" p={4} borderRadius="md" textAlign="center">{error}</Box>
            )}

            {vehicle && (
              <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
                <Box p={6}>
                  <Heading size="lg" mb={4} color="gray.800">{vehicle.make} {vehicle.model} {vehicle.grade}</Heading>

                  {/* Main Image */}
                 {/* Main Image with Navigation Arrows */}
    <Box
      ref={mainImageRef}
      w="full"
      h="auto"
      mb={4}
      borderRadius="md"
      overflow="hidden"
      position="relative"
      onMouseEnter={() => setZoomVisible(true)}
      onMouseLeave={() => setZoomVisible(false)}
      onMouseMove={handleMouseMove}
      cursor="zoom-in"
      onClick={onOpen}
    >
      <Skeleton isLoaded={!imageLoading} w="full" h="500px" borderRadius="8px">
        {selectedPhoto && (
          <Image
            src={selectedPhoto}
            alt={`${vehicle.make} ${vehicle.model}`}
            width={750}
            height={500}
            style={{
              objectFit: "cover",
              borderRadius: "8px",
              transition: "transform 0.3s ease-in-out",
            }}
            onLoadingComplete={handleImageLoad}
          />
        )}
      </Skeleton>

      {/* Zoom overlay */}
      {zoomVisible && selectedPhoto && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgImage={`url(${selectedPhoto})`}
          bgRepeat="no-repeat"
          bgSize="200%"
          bgPosition={`${zoomPosition.x}% ${zoomPosition.y}%`}
          pointerEvents="none"
          borderRadius="8px"
          zIndex={10}
        />
      )}

      {/* Left Arrow */}
      <IconButton
        icon={<FaChevronLeft />}
        aria-label="Previous"
        position="absolute"
        left="4"
        top="50%"
        transform="translateY(-50%)"
        color="white"
        bg="blackAlpha.500"
        _hover={{ bg: "blackAlpha.700" }}
        onClick={(e) => {
          e.stopPropagation();
          prevPhoto();
        }}
        zIndex={20}
        size="lg"
        rounded="full"
      />

      {/* Right Arrow */}
      <IconButton
        icon={<FaChevronRight />}
        aria-label="Next"
        position="absolute"
        right="4"
        top="50%"
        transform="translateY(-50%)"
        color="white"
        bg="blackAlpha.500"
        _hover={{ bg: "blackAlpha.700" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        nextPhoto();
                      }}
                      zIndex={20}
                      size="lg"
                      rounded="full"
                    />
                  </Box>


                  {/* Fullscreen Modal with Arrows and Thumbnails */}
                  <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
                    <ModalOverlay bg="blackAlpha.800" />
                    <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
                      <ModalCloseButton color="white" zIndex={20} />
                      <ModalBody display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={0} position="relative">
                        {/* Arrows */}
                        <IconButton
                          icon={<FaChevronLeft />}
                          aria-label="Previous"
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          color="white"
                          bg="blackAlpha.400"
                          _hover={{ bg: "blackAlpha.600" }}
                          onClick={prevPhoto}
                          zIndex={20}
                        />
                        <IconButton
                          icon={<FaChevronRight />}
                          aria-label="Next"
                          position="absolute"
                          right={2}
                          top="50%"
                          transform="translateY(-50%)"
                          color="white"
                          bg="blackAlpha.400"
                          _hover={{ bg: "blackAlpha.600" }}
                          onClick={nextPhoto}
                          zIndex={20}
                        />

                        {selectedPhoto && (
                          <Image
                            src={selectedPhoto}
                            alt={`${vehicle.make} ${vehicle.model} full`}
                            width={1920}
                            height={1080}
                            style={{ objectFit: "contain", maxHeight: "80vh" }}
                          />
                        )}

                        {/* Thumbnail strip */}
                        <Flex mt={4} gap={2} overflowX="auto" px={4} w="full" justifyContent="center">
                          {vehicle.photos.map((photo, idx) => (
                            <Box
                              key={idx}
                              ref={(el) => (modalThumbnailsRef.current[idx] = el)}
                              w="80px"
                              h="50px"
                              borderRadius="md"
                              overflow="hidden"
                              border={selectedIndex === idx ? "2px solid green" : "2px solid transparent"}
                              cursor="pointer"
                              onClick={() => handleThumbnailClick(photo.image_url, idx)}
                            >
                              <Image
                                src={photo.image_url}
                                alt={`Thumbnail ${idx + 1}`}
                                width={80}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                          ))}
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>

                  {/* Thumbnails below main image */}
                  <Flex gap={2} overflowX="auto">
                    {vehicle.photos.map((photo, idx) => (
                      <Box
                        key={idx}
                        ref={(el) => (inlineThumbnailsRef.current[idx] = el)}
                        flex="0 0 auto"
                        w="100px"
                        h="70px"
                        borderRadius="md"
                        overflow="hidden"
                        border={selectedIndex === idx ? "2px solid green" : "2px solid transparent"}
                        cursor="pointer"
                        onClick={() => handleThumbnailClick(photo.image_url, idx)}
                      >
                        <Skeleton isLoaded={selectedIndex !== idx || !imageLoading} w="100px" h="70px" borderRadius="md">
                          <Image src={photo.image_url} alt={`Thumbnail ${idx + 1}`} width={100} height={70} style={{ objectFit: "cover" }} />
                        </Skeleton>
                      </Box>
                    ))}
                  </Flex>

                  {/* Tabs Section */}
                  <Box mt={8}>
                    <Tabs variant="unstyled" isFitted>
                      <TabList borderBottom="1px solid #dee2e6">
                        <Tab _selected={{ color: "green.700", borderBottom: "3px solid green", fontWeight: "bold" }} _focus={{ boxShadow: "none" }} fontSize="md" px={4} py={2}>
                          Vehicle Information
                        </Tab>
                        <Tab _selected={{ color: "green.700", borderBottom: "3px solid green", fontWeight: "bold" }} _focus={{ boxShadow: "none" }} fontSize="md" px={4} py={2}>
                          Features
                        </Tab>
                      </TabList>

                      <TabPanels>
                        <TabPanel>
                          <Flex direction="column" gap={4}>
                            <Flex wrap="wrap" gap={4}>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>Make:</strong> {vehicle.make}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>Model:</strong> {vehicle.model}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>Year:</strong> {vehicle.year}</Text></HStack>
                            </Flex>
                            <Flex wrap="wrap" gap={4}>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaGasPump} boxSize={5} color="gray.500" /><Text><strong>Fuel:</strong> {vehicle.fuel}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>Colour:</strong> {vehicle.colour}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaRoad} boxSize={5} color="gray.500" /><Text><strong>Mileage:</strong> {vehicle.mileage ?? "N/A"} {vehicle.mileage_unit}</Text></HStack>
                            </Flex>
                            <Flex wrap="wrap" gap={4}>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaTachometerAlt} boxSize={5} color="gray.500" /><Text><strong>Engine CC:</strong> {vehicle.engine_cc ?? "N/A"}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>Transmission:</strong> {vehicle.transm ?? "N/A"}</Text></HStack>
                              <HStack spacing={2} flex="1 1 200px"><Icon as={FaCar} boxSize={5} color="gray.500" /><Text><strong>No of doors:</strong> {vehicle.no_of_doors ?? "N/A"}</Text></HStack>
                            </Flex>
                          </Flex>
                        </TabPanel>

                        <TabPanel>
                          <Flex wrap="wrap" gap={3}>
                            {vehicle.features && vehicle.features.length > 0 ? (
                              vehicle.features.map((feature: string, idx: number) => (
                                <Tag key={idx} size="sm" colorScheme="green" variant="subtle">{feature}</Tag>
                              ))
                            ) : (<Text>No features available.</Text>)}
                          </Flex>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Sidebar Column */}
          <Box flex="0 0 33.333%" maxW={{ xl: "33.333%" }}>
            {/* Placeholder for additional info or ads */}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
