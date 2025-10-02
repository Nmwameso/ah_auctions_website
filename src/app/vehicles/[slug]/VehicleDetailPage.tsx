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
  VStack,
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
  Button,
  Card,
  CardBody,
  Stack,
  Divider,
  Badge,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaRoad,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaPalette,
  FaCog,
  FaDoorClosed,
  FaChair,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { FiArrowLeft, FiShare2, FiHeart } from "react-icons/fi";

// Props interface for the component
interface VehicleDetailPageProps {
  serverData: {
    initialVehicle: any;
    initialLoading: boolean;
    initialError: string | null;
  };
  slug: string;
}

export default function VehicleDetailPage({ serverData, slug }: VehicleDetailPageProps) {
  const params = useParams();
  const currentVehicleId = String(params.slug);

  const { vehicle, loading, error, fetchVehicleById, clearVehicle } = useVehicleStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Thumbnail refs for auto-scrolling
  const modalThumbnailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const inlineThumbnailsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check if vehicle ID has changed from server data
  const hasVehicleIdChanged = serverData.initialVehicle?.slug !== currentVehicleId;

  // Initialize store with server data only if it's for the same vehicle
  useEffect(() => {
    if (serverData.initialVehicle && !hasVehicleIdChanged) {
      useVehicleStore.setState({
        vehicle: serverData.initialVehicle,
        loading: serverData.initialLoading,
        error: serverData.initialError,
      });
    }
  }, [serverData, hasVehicleIdChanged]);

  // Fetch data when vehicle ID changes or if no server data available
  useEffect(() => {
    // If vehicle ID changed or no server data, fetch new data
    if (hasVehicleIdChanged || !serverData.initialVehicle) {
      fetchVehicleById(currentVehicleId);
    }
  }, [currentVehicleId, hasVehicleIdChanged, fetchVehicleById, serverData.initialVehicle]);

  // Clear vehicle data when component unmounts
  useEffect(() => {
    return () => {
      clearVehicle();
    };
  }, [clearVehicle]);

  // Reset photo selection when vehicle changes
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

  const scrollToThumbnail = (idx: number) => {
  // Only scroll the modal thumbnails horizontally
  modalThumbnailsRef.current[idx]?.scrollIntoView({ 
    behavior: "smooth", 
    inline: "center",
    block: "nearest" // This prevents vertical scrolling
  });
  
  // Only scroll the inline thumbnails horizontally  
  inlineThumbnailsRef.current[idx]?.scrollIntoView({ 
    behavior: "smooth", 
    inline: "center",
    block: "nearest" // This prevents vertical scrolling
  });
};

  const prevPhoto = () => {
    if (!vehicle?.photos) return;
    const newIndex = (selectedIndex - 1 + vehicle.photos.length) % vehicle.photos.length;
    setSelectedPhoto(vehicle.photos[newIndex].image_url);
    setSelectedIndex(newIndex);
    scrollToThumbnail(newIndex);
  };

  const nextPhoto = () => {
    if (!vehicle?.photos) return;
    const newIndex = (selectedIndex + 1) % vehicle.photos.length;
    setSelectedPhoto(vehicle.photos[newIndex].image_url);
    setSelectedIndex(newIndex);
    scrollToThumbnail(newIndex);
   
  };

  // Use appropriate data based on whether vehicle ID changed
  const displayVehicle = hasVehicleIdChanged ? vehicle : (vehicle || serverData.initialVehicle);
  const displayLoading = hasVehicleIdChanged ? loading : (loading && !serverData.initialVehicle);
  const displayError = hasVehicleIdChanged ? error : (error || serverData.initialError);

  // Calculate the price with 10% markup
  const displayPrice = displayVehicle?.price_usd 
    ? Math.ceil((displayVehicle.price_usd * 1.1) / 100) * 100
    : displayVehicle?.price 
    ? Math.ceil((displayVehicle.price * 0.0068 * 1.1) / 100) * 100
    : null;

  // Generate metadata for the page
  const pageTitle = displayVehicle 
    ? `${displayVehicle.make} ${displayVehicle.model} ${displayVehicle.year} - Car Import`
    : 'Vehicle Details - Car Import';
  
  const pageDescription = displayVehicle
    ? `Explore the ${displayVehicle.year} ${displayVehicle.make} ${displayVehicle.model}. ${displayVehicle.fuel} • ${displayVehicle.transm} • ${displayVehicle.mileage} ${displayVehicle.mileage_unit}. Import your dream car today!`
    : 'Find your perfect imported vehicle with detailed specifications and photos.';

  const mainImage = selectedPhoto || displayVehicle?.main_photo;

  // Auction status simulation (Copart style)
  const auctionStatus = {
    status: "Active",
    timeLeft: "2 days 4 hours",
    bids: 12,
    currentBid: displayPrice ? displayPrice - 500 : 0,
    reserve: "No Reserve"
  };

  return (
    <>
      {/* Metadata - This will be rendered in the head */}
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${displayVehicle?.make}, ${displayVehicle?.model}, imported cars, japan cars, used cars, ${displayVehicle?.year} ${displayVehicle?.make} ${displayVehicle?.model}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`http://localhost:3000/vehicles/${currentVehicleId}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {mainImage && <meta property="og:image" content={mainImage} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`http://localhost:3000/vehicles/${currentVehicleId}`} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        {mainImage && <meta property="twitter:image" content={mainImage} />}
        
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`http://localhost:3000/vehicles/${currentVehicleId}`} />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Vehicle",
              "name": displayVehicle ? `${displayVehicle.make} ${displayVehicle.model}` : "Vehicle",
              "description": pageDescription,
              "image": mainImage ? [mainImage] : [],
              "brand": {
                "@type": "Brand",
                "name": displayVehicle?.make
              },
              "model": displayVehicle?.model,
              "vehicleModelDate": displayVehicle?.year,
              "vehicleTransmission": displayVehicle?.transm,
              "fuelType": displayVehicle?.fuel,
              "mileageFromOdometer": {
                "@type": "QuantitativeValue",
                "value": displayVehicle?.mileage,
                "unitCode": displayVehicle?.mileage_unit === 'km' ? 'KMT' : 'MI'
              },
              "color": displayVehicle?.colour,
              "numberOfDoors": displayVehicle?.no_of_doors,
              "vehicleEngine": {
                "@type": "EngineSpecification",
                "engineDisplacement": {
                  "@type": "QuantitativeValue",
                  "value": displayVehicle?.engine_cc,
                  "unitCode": "CMQ"
                }
              }
            })
          }}
        />
      </head>

      <Box bg="gray.50" minH="100vh">
        {/* Header Section - Copart Style */}
        <Box as="section" bg="white" borderBottom="1px" borderColor="gray.200" py={3}>
          <Container maxW="7xl">
            <Flex justify="space-between" align="center" mb={2}>
              <Breadcrumb fontSize="sm" color="gray.600">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" _hover={{ color: "red.500" }}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/vehicles" _hover={{ color: "red.500" }}>Vehicles</BreadcrumbLink>
                </BreadcrumbItem>
                 <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={`/vehicles?make=${displayVehicle ? displayVehicle.make : ''}`} 
                    _hover={{ color: "red.500" }}
                  >
                    {displayVehicle ? `${displayVehicle.make}` : 'Loading...'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                 <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={`/vehicles?make=${displayVehicle ? displayVehicle.make : ''} & model=${displayVehicle ? displayVehicle.model : ''} `} 
                    _hover={{ color: "red.500" }}
                  >
                    {displayVehicle ? `${displayVehicle.model}` : 'Loading...'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#" color="gray.800" fontWeight="bold">
                    {displayVehicle ? `${displayVehicle.make} ${displayVehicle.model}` : 'Loading...'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              
              <HStack spacing={3}>
                <Button size="sm" variant="outline" leftIcon={<FiShare2 />} colorScheme="gray">
                  Share
                </Button>
                <Button size="sm" variant="outline" leftIcon={<FiHeart />} colorScheme="gray">
                  Watch
                </Button>
              </HStack>
            </Flex>

            <Heading size="lg" color="gray.800" fontWeight="bold">
              {displayVehicle ? `${displayVehicle.year} ${displayVehicle.make} ${displayVehicle.model}` : 'Vehicle Details'}
            </Heading>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="7xl" py={6}>
          <Flex direction={{ base: "column", lg: "row" }} gap={6}>
            {/* Left Column - Gallery & Details */}
            <Box flex="1" minW={0}>
              {displayLoading && (
                <Flex justify="center" py={20}>
                  <Spinner size="xl" color="red.500" thickness="4px" />
                </Flex>
              )}

              {!displayLoading && displayError && (
                <Card bg="red.50" color="red.600" p={6} textAlign="center" shadow="sm">
                  <Text fontSize="lg" fontWeight="bold">{displayError}</Text>
                  <Button mt={4} colorScheme="red" as={Link} href="/vehicles">
                    Back to Vehicles
                  </Button>
                </Card>
              )}

              {displayVehicle && (
                <Stack spacing={6}>
                  {/* Main Image Gallery */}
                  <Card shadow="md" border="1px" borderColor="gray.200" overflow="hidden">
                    <CardBody p={0}>
                      <Box position="relative">
                        {/* Main Image */}
                        <Box
                          w="full"
                          h="500px"
                          position="relative"
                          cursor={displayVehicle.photos?.length ? "zoom-in" : "default"}
                          onClick={displayVehicle.photos?.length ? onOpen : undefined}
                        >
                          <Skeleton isLoaded={!imageLoading} w="full" h="full">
                            {selectedPhoto && (
                              <Image
                                src={selectedPhoto}
                                alt={`${displayVehicle.make} ${displayVehicle.model} ${displayVehicle.year}`}
                                fill
                                style={{
                                  objectFit: "cover",
                                }}
                                onLoadingComplete={handleImageLoad}
                                priority
                              />
                            )}
                          </Skeleton>

                          {/* Auction Badge */}
                          <Badge 
                            position="absolute" 
                            top={4} 
                            left={4} 
                            colorScheme="green" 
                            fontSize="sm" 
                            px={3} 
                            py={1} 
                            borderRadius="full"
                          >
                            LIVE AUCTION
                          </Badge>

                          {/* Price Badge */}
                          {displayPrice && (
                            <Box
                              position="absolute"
                              top={4}
                              right={4}
                              bg="red.500"
                              color="white"
                              px={4}
                              py={2}
                              fontWeight="bold"
                              fontSize="xl"
                              borderRadius="md"
                              boxShadow="lg"
                            >
                              ${displayPrice.toLocaleString()}
                            </Box>
                          )}

                          {/* Navigation Arrows */}
                          {displayVehicle.photos && displayVehicle.photos.length > 1 && (
                            <>
                              <IconButton
                                icon={<FaChevronLeft />}
                                aria-label="Previous photo"
                                position="absolute"
                                left={4}
                                top="50%"
                                transform="translateY(-50%)"
                                color="white"
                                bg="blackAlpha.600"
                                _hover={{ bg: "blackAlpha.800" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevPhoto();
                                }}
                                size="lg"
                                rounded="full"
                              />
                              <IconButton
                                icon={<FaChevronRight />}
                                aria-label="Next photo"
                                position="absolute"
                                right={4}
                                top="50%"
                                transform="translateY(-50%)"
                                color="white"
                                bg="blackAlpha.600"
                                _hover={{ bg: "blackAlpha.800" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextPhoto();
                                }}
                                size="lg"
                                rounded="full"
                              />
                            </>
                          )}
                        </Box>

                        {/* Thumbnails */}
                        {displayVehicle.photos && displayVehicle.photos.length > 1 && (
                          <Flex gap={2} p={4} overflowX="auto" bg="gray.50">
                            {displayVehicle.photos.map((photo: any, idx: number) => (
                              <Box
                                key={idx}
                                ref={(el) => (inlineThumbnailsRef.current[idx] = el)}
                                flex="0 0 auto"
                                w="80px"
                                h="60px"
                                borderRadius="md"
                                overflow="hidden"
                                border={selectedIndex === idx ? "3px solid red" : "2px solid gray.300"}
                                cursor="pointer"
                                onClick={() => handleThumbnailClick(photo.image_url, idx)}
                              >
                                <Image 
                                  src={photo.image_url} 
                                  alt={`Thumbnail ${idx + 1}`} 
                                  width={80} 
                                  height={60} 
                                  style={{ objectFit: "cover" }} 
                                />
                              </Box>
                            ))}
                          </Flex>
                        )}
                      </Box>
                    </CardBody>
                  </Card>

                  {/* Vehicle Details Tabs */}
                  <Card shadow="md" border="1px" borderColor="gray.200">
                    <Tabs variant="enclosed" colorScheme="red">
                      <TabList bg="gray.50" borderBottom="1px" borderColor="gray.200">
                        <Tab fontWeight="semibold" _selected={{ bg: "white", borderColor: "gray.300", borderBottom: "none" }}>
                          Vehicle Details
                        </Tab>
                        <Tab fontWeight="semibold" _selected={{ bg: "white", borderColor: "gray.300", borderBottom: "none" }}>
                          Features & Options
                        </Tab>
                     
                      </TabList>

                      <TabPanels>
                        {/* Vehicle Details Tab */}
                        <TabPanel p={6}>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <VStack align="start" spacing={4}>
                              <Heading size="md" color="gray.800" mb={2}>Basic Information</Heading>
                              <HStack spacing={4} w="full">
                                <Icon as={FaCar} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Make & Model</Text>
                                  <Text fontWeight="semibold">{displayVehicle.make} {displayVehicle.model}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaCalendar} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Year</Text>
                                  <Text fontWeight="semibold">{displayVehicle.year}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaPalette} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Color</Text>
                                  <Text fontWeight="semibold">{displayVehicle.colour || "N/A"}</Text>
                                </Box>
                              </HStack>
                            </VStack>

                            <VStack align="start" spacing={4}>
                              <Heading size="md" color="gray.800" mb={2}>Technical Specs</Heading>
                              <HStack spacing={4} w="full">
                                <Icon as={FaGasPump} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Fuel Type</Text>
                                  <Text fontWeight="semibold">{displayVehicle.fuel || "N/A"}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaCog} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Transmission</Text>
                                  <Text fontWeight="semibold">{displayVehicle.transm || "N/A"}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaRoad} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Mileage</Text>
                                  <Text fontWeight="semibold">
                                    {displayVehicle.mileage ? `${displayVehicle.mileage.toLocaleString()} ${displayVehicle.mileage_unit}` : "N/A"}
                                  </Text>
                                </Box>
                              </HStack>
                            </VStack>
                          </SimpleGrid>

                          <Divider my={6} />

                          {/* Additional Details */}
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <VStack align="start" spacing={4}>
                              <HStack spacing={4} w="full">
                                <Icon as={FaTachometerAlt} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Engine Size</Text>
                                  <Text fontWeight="semibold">{displayVehicle.engine_cc || "N/A"}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaDoorClosed} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Doors</Text>
                                  <Text fontWeight="semibold">{displayVehicle.no_of_doors || "N/A"}</Text>
                                </Box>
                              </HStack>
                            </VStack>
                            <VStack align="start" spacing={4}>
                              <HStack spacing={4} w="full">
                                <Icon as={FaChair} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Seats</Text>
                                  <Text fontWeight="semibold">{displayVehicle.no_of_seats || "N/A"}</Text>
                                </Box>
                              </HStack>
                              <HStack spacing={4} w="full">
                                <Icon as={FaExclamationTriangle} color="red.500" boxSize={5} />
                                <Box flex="1">
                                  <Text fontSize="sm" color="gray.600">Accident History</Text>
                                  <Text fontWeight="semibold" color={displayVehicle.accident_flg ? "red.500" : "green.500"}>
                                    {displayVehicle.accident_flg ? "Yes" : "No"}
                                  </Text>
                                </Box>
                              </HStack>
                            </VStack>
                          </SimpleGrid>
                        </TabPanel>

                        {/* Features Tab */}
                        <TabPanel p={6}>
                          <Heading size="md" color="gray.800" mb={4}>Features & Options</Heading>
                          {displayVehicle.features && displayVehicle.features.length > 0 ? (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                              {displayVehicle.features.map((feature: string, idx: number) => (
                                <HStack key={idx} spacing={2} bg="green.50" p={2} borderRadius="md">
                                  <Box w={2} h={2} bg="green.500" borderRadius="full" />
                                  <Text fontSize="sm">{feature}</Text>
                                </HStack>
                              ))}
                            </SimpleGrid>
                          ) : (
                            <Text color="gray.600">{displayVehicle.more_info || "No additional features listed."}</Text>
                          )}
                        </TabPanel>

                       
                      </TabPanels>
                    </Tabs>
                  </Card>
                </Stack>
              )}
            </Box>

            {/* Right Column - Auction Actions */}
            <Box w={{ base: "full", lg: "400px" }} flexShrink={0}>
              <Stack spacing={6}>
                {/* Auction Action Card */}
                <Card shadow="lg" border="1px" borderColor="gray.200" bg="white">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="gray.800" textAlign="center">
                        Place Your Bid
                      </Heading>

                      <Button colorScheme="red" size="lg" fontWeight="bold" py={6}>
                        PLACE BID NOW
                      </Button>

                      <Button variant="outline" colorScheme="blue" size="md">
                        MAKE OFFER
                      </Button>

                      <HStack justify="center" spacing={4} pt={2}>
                        <Button variant="ghost" size="sm" leftIcon={<FiHeart />}>
                          Watch
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<FiShare2 />}>
                          Share
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Vehicle Summary Card */}
                <Card shadow="md" border="1px" borderColor="gray.200">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="gray.800">Quick Facts</Heading>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">VIN:</Text>
                        <Text fontSize="sm" fontWeight="semibold">{displayVehicle?.inventory_no || "N/A"}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Location:</Text>
                        <Text fontSize="sm" fontWeight="semibold">Japan</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Grade:</Text>
                        <Text fontSize="sm" fontWeight="semibold">{displayVehicle?.grade || "N/A"}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">Body Type:</Text>
                        <Text fontSize="sm" fontWeight="semibold">{displayVehicle?.body_type_name || "N/A"}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Safety & Shipping Card */}
                <Card shadow="md" border="1px" borderColor="gray.200">
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack>
                        <Icon as={FaShieldAlt} color="green.500" boxSize={5} />
                        <Text fontWeight="semibold">Buy with Confidence</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        All vehicles undergo thorough inspection and come with detailed condition reports.
                      </Text>
                      <Button variant="outline" colorScheme="green" size="sm" w="full">
                        View Inspection Report
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Stack>
            </Box>
          </Flex>
        </Container>

        {/* Fullscreen Image Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh">
            <ModalCloseButton color="white" zIndex={20} size="lg" />
            <ModalBody display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={0} position="relative">
              {/* Navigation Arrows */}
              {displayVehicle?.photos && displayVehicle.photos.length > 1 && (
                <>
                  <IconButton
                    icon={<FaChevronLeft />}
                    aria-label="Previous photo"
                    position="absolute"
                    left={8}
                    top="50%"
                    transform="translateY(-50%)"
                    color="white"
                    bg="blackAlpha.600"
                    _hover={{ bg: "blackAlpha.800" }}
                    onClick={prevPhoto}
                    zIndex={20}
                    size="lg"
                  />
                  <IconButton
                    icon={<FaChevronRight />}
                    aria-label="Next photo"
                    position="absolute"
                    right={8}
                    top="50%"
                    transform="translateY(-50%)"
                    color="white"
                    bg="blackAlpha.600"
                    _hover={{ bg: "blackAlpha.800" }}
                    onClick={nextPhoto}
                    zIndex={20}
                    size="lg"
                  />
                </>
              )}

              {selectedPhoto && (
                <Image
                  src={selectedPhoto}
                  alt={`${displayVehicle?.make} ${displayVehicle?.model} ${displayVehicle?.year} - Full screen view`}
                  width={1920}
                  height={1080}
                  style={{ objectFit: "contain", maxHeight: "80vh" }}
                />
              )}

              {/* Thumbnail strip */}
              {displayVehicle?.photos && displayVehicle.photos.length > 1 && (
                <Flex mt={4} gap={2} overflowX="auto" px={4} w="full" justifyContent="center">
                  {displayVehicle.photos.map((photo: any, idx: number) => (
                    <Box
                      key={idx}
                      ref={(el) => (modalThumbnailsRef.current[idx] = el)}
                      w="80px"
                      h="50px"
                      borderRadius="md"
                      overflow="hidden"
                      border={selectedIndex === idx ? "3px solid red" : "2px solid gray.400"}
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
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}