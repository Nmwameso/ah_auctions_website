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
} from "@chakra-ui/react";
import {
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaRoad,
} from "react-icons/fa";
import { useVehicleStore } from "../stores/useVehicleStore";

const MotionBox = motion(Box);

export default function LatestVehicles() {
  const { vehicles, loading, fetchVehicles } = useVehicleStore();

  useEffect(() => {
    if (vehicles.length === 0) fetchVehicles();
  }, [fetchVehicles, vehicles.length]);
  console.log(vehicles);
  
  // ✅ Filter Trucks from 2024 onwards
  const latestVehicles = useMemo(() => {
    return vehicles.filter(
      (v) => Number(v.vehicle_type) === 1
    );
  }, [vehicles]);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Box bg="white" py={12}>
      <Box maxW="7xl" mx="auto" px={4}>
        {/* Section Title */}
        <VStack spacing={3} textAlign="center" mb={8}>
          <Heading size="2xl" color="gray.800">
            Latest Cars Available
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Browse our collection of cars from 2024 onwards
          </Text>
        </VStack>

        {/* Loader */}
        {loading && (
          <Flex justify="center" my={8}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        )}

        {/* Vehicle List */}
        {!loading && latestVehicles.length > 0 && (
          <MotionBox
            as={Flex}
            overflowX="auto"
            gap={6}
            pb={4}
            css={{
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "8px",
              },
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {latestVehicles.map((vehicle) => (
              <MotionBox
                key={vehicle.vehicle_id}
                bg={cardBg}
                rounded="lg"
                shadow={cardShadow}
                minW="280px"
                maxW="280px"
                borderWidth="1px"
                position="relative"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.25 }}
              >
                {/* Ribbon */}
                {vehicle.accident_status === 1 && (
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="red"
                    rounded="md"
                    px={2}
                  >
                    Accident
                  </Badge>
                )}
                {vehicle.accident_status === 0 && (
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="green"
                    rounded="md"
                    px={2}
                  >
                    Non-Accident
                  </Badge>
                )}

                {/* Vehicle Image */}
                <Link href={`/vehicles/${vehicle.vehicle_id}`}>
                  <Box position="relative" height="180px">
                    <Image
                      src={vehicle.main_photo || "/assets/images/no-image.png"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <Badge
                      position="absolute"
                      bottom={2}
                      left={2}
                      colorScheme="green"
                      rounded="md"
                      px={2}
                    >
                      {vehicle.year} - {vehicle.month}
                    </Badge>
                  </Box>
                </Link>

                {/* Vehicle Info */}
                <Box p={4}>
                  <Link href={`/vehicles/${vehicle.vehicle_id}`}>
                    <Heading
                      as="h5"
                      size="md"
                      mb={2}
                      noOfLines={1}
                      color="gray.800"
                      _hover={{ color: "green" }}
                    >
                      {vehicle.make} {vehicle.model} {vehicle.grade}
                    </Heading>
                  </Link>

                  {vehicle.inventory_no && (
                    <Text fontSize="sm" color="gray.500">
                      Stock ID: {vehicle.inventory_no}
                    </Text>
                  )}
                </Box>

                {/* Footer */}
                <HStack
                  spacing={5}
                  px={4}
                  pb={4}
                  justify="space-between"
                  fontSize="sm"
                  color="gray.600"
                >
                  {vehicle.engine_cc && (
                    <Tooltip label="Engine CC" hasArrow>
                      <HStack>
                        <FaTachometerAlt />
                        <Text>{vehicle.engine_cc}</Text>
                      </HStack>
                    </Tooltip>
                  )}

                  <Tooltip label="Transmission" hasArrow>
                    <HStack>
                      <FaCar />
                      <Text>{vehicle.transm || "Auto"}</Text>
                    </HStack>
                  </Tooltip>

                  <Tooltip label="Mileage" hasArrow>
                    <HStack>
                      <FaRoad />
                      <Text>
                        {vehicle.mileage} {vehicle.mileage_unit}
                      </Text>
                    </HStack>
                  </Tooltip>

                  <Tooltip label="Fuel Type" hasArrow>
                    <HStack>
                      <FaGasPump />
                      <Text>{vehicle.fuel}</Text>
                    </HStack>
                  </Tooltip>
                </HStack>
              </MotionBox>
            ))}
          </MotionBox>
        )}

        {/* No Trucks */}
        {!loading && latestVehicles.length === 0 && (
          <Flex justify="center" my={10}>
            <Text fontSize="lg" color="gray.500">
              No latest cars available right now.
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
