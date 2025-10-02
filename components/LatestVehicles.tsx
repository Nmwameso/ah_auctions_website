"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Spinner,
  VStack,
  HStack,
  Tooltip,
  useColorModeValue,
  Container,
  Button,
  Icon,
  Card,
  CardBody,
  Stack,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import {
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaRoad,
  FaCalendar,
  FaPalette,
  FaGavel,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiHeart, FiShare2, FiArrowRight } from "react-icons/fi";
import { useVehicleStore } from "../stores/useVehicleStore";

const MotionBox = motion(Box);

export default function LatestVehicles() {
  const { vehicles, loading, getVehicles } = useVehicleStore();

  useEffect(() => {
    if (vehicles.length === 0) getVehicles();
  }, [getVehicles, vehicles.length]);
  
  // ✅ Filter Cars from 2024 onwards
  const latestVehicles = useMemo(() => {
    return vehicles.filter(
      (v) => Number(v.vehicle_type) === 1
    ).slice(0, 6); // Show only 6 latest vehicles
  }, [vehicles]);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("lg", "dark-lg");

  // Calculate price with 10% markup
  const calculatePrice = (vehicle: any) => {
    return vehicle.price_usd 
      ? Math.ceil((vehicle.price_usd * 1.1) / 100) * 100
      : vehicle.price 
      ? Math.ceil((vehicle.price * 0.0068 * 1.1) / 100) * 100
      : null;
  };

  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="7xl">
        {/* Section Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading size="xl" color="gray.800" fontWeight="bold">
              Featured Vehicles
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Bid on our latest premium vehicles from trusted auctions
            </Text>
          </VStack>
          <Button 
            colorScheme="red" 
            variant="outline" 
            rightIcon={<FiArrowRight />}
            as={Link}
            href="/vehicles"
          >
            View All Vehicles
          </Button>
        </Flex>

        {/* Loader */}
        {loading && (
          <Flex justify="center" my={16}>
            <VStack spacing={4}>
              <Spinner size="xl" color="red.500" thickness="4px" />
              <Text color="gray.600">Loading featured vehicles...</Text>
            </VStack>
          </Flex>
        )}

        {/* Vehicle Grid */}
        {!loading && latestVehicles.length > 0 && (
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={6}
          >
            {latestVehicles.map((vehicle) => {
              const displayPrice = calculatePrice(vehicle);
              
              return (
                <MotionBox
                  key={vehicle.vehicle_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    bg={cardBg}
                    shadow={cardShadow}
                    border="1px"
                    borderColor="gray.200"
                    overflow="hidden"
                    position="relative"
                    _hover={{ shadow: "xl" }}
                    transition="all 0.3s"
                  >
                    {/* Auction Badges */}
                    <Box position="absolute" top={3} left={3} zIndex={2}>
                      <Badge colorScheme="green" fontSize="xs" px={2} py={1} borderRadius="full">
                        LIVE
                      </Badge>
                    </Box>

                    {/* Action Buttons */}
                    <Box position="absolute" top={3} right={3} zIndex={2}>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Add to watchlist"
                          icon={<FiHeart />}
                          size="sm"
                          bg="white"
                          color="gray.600"
                          _hover={{ bg: "gray.50", color: "red.500" }}
                        />
                        <IconButton
                          aria-label="Share vehicle"
                          icon={<FiShare2 />}
                          size="sm"
                          bg="white"
                          color="gray.600"
                          _hover={{ bg: "gray.50", color: "blue.500" }}
                        />
                      </HStack>
                    </Box>

                    {/* Vehicle Image */}
                    <Link href={`/vehicles/${vehicle.slug}`}>
                      <Box position="relative" height="200px" cursor="pointer">
                        <Image
                          src={vehicle.main_photo || "/assets/images/no-image.png"}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        {/* Price Overlay */}
                        {displayPrice && (
                          <Box
                            position="absolute"
                            bottom={0}
                            left={0}
                            right={0}
                            bg="linear-gradient(transparent, rgba(0,0,0,0.8))"
                            color="white"
                            p={3}
                          >
                            <Flex justify="space-between" align="center">
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" opacity={0.9}>Current Bid</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  ${displayPrice.toLocaleString()}
                                </Text>
                              </VStack>
                              
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    </Link>

                    <CardBody p={4}>
                      {/* Vehicle Title */}
                      <Link href={`/vehicles/${vehicle.slug}`}>
                        <Heading 
                          size="md" 
                          mb={2} 
                          color="gray.800"
                          _hover={{ color: "red.500" }}
                          transition="color 0.2s"
                        >
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </Heading>
                      </Link>

                      {/* Quick Specs */}
                      <Stack spacing={2} mb={4}>
                        <HStack spacing={4} color="gray.600" fontSize="sm">
                          <HStack spacing={1}>
                            <Icon as={FaMapMarkerAlt} color="red.500" boxSize={3} />
                            <Text>Japan</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaCalendar} color="red.500" boxSize={3} />
                            <Text>{vehicle.year}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaRoad} color="red.500" boxSize={3} />
                            <Text>
                              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} ${vehicle.mileage_unit}` : "N/A"}
                            </Text>
                          </HStack>
                        </HStack>

                        <HStack spacing={4} color="gray.600" fontSize="sm">
                          <HStack spacing={1}>
                            <Icon as={FaGasPump} color="red.500" boxSize={3} />
                            <Text>{vehicle.fuel || "N/A"}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaCar} color="red.500" boxSize={3} />
                            <Text>{vehicle.transm || "N/A"}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaPalette} color="red.500" boxSize={3} />
                            <Text>{vehicle.colour || "N/A"}</Text>
                          </HStack>
                        </HStack>
                      </Stack>

                      {/* Condition & Details */}
                      <Flex justify="space-between" align="center" mb={4}>
                        <Badge 
                          colorScheme={vehicle.accident_status === 0 ? "green" : "red"}
                          fontSize="xs"
                          px={2}
                          py={1}
                        >
                          {vehicle.accident_status === 0 ? "CLEAN TITLE" : "ACCIDENT"}
                        </Badge>
                        {vehicle.engine_cc && (
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">
                            {vehicle.engine_cc}
                          </Text>
                        )}
                      </Flex>

                      {/* Bid Button */}
                      <Button
                        colorScheme="red"
                        size="sm"
                        w="full"
                        leftIcon={<Icon as={FaGavel} />}
                        fontWeight="bold"
                        as={Link}
                        href={`/vehicles/${vehicle.slug}`}
                        _hover={{
                          transform: "translateY(-1px)",
                          shadow: "md",
                        }}
                        transition="all 0.2s"
                      >
                        BID NOW
                      </Button>
                    </CardBody>
                  </Card>
                </MotionBox>
              );
            })}
          </SimpleGrid>
        )}

        {/* No Vehicles */}
        {!loading && latestVehicles.length === 0 && (
          <Card bg="white" shadow="md" textAlign="center" py={12}>
            <CardBody>
              <VStack spacing={4}>
                <Icon as={FaCar} boxSize={12} color="gray.400" />
                <Heading size="md" color="gray.600">
                  No Featured Vehicles Available
                </Heading>
                <Text color="gray.500">
                  Check back later for new auction listings
                </Text>
                <Button colorScheme="red" as={Link} href="/vehicles">
                  Browse All Vehicles
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* View All CTA */}
        {!loading && latestVehicles.length > 0 && (
          <Flex justify="center" mt={12}>
            <Button
              colorScheme="red"
              size="lg"
              rightIcon={<FiArrowRight />}
              as={Link}
              href="/vehicles"
              px={8}
              py={6}
              fontWeight="bold"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              VIEW ALL VEHICLES
            </Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
}