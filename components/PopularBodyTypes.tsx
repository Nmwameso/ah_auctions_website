"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Box,
  Grid,
  Heading,
  Text,
  Spinner,
  VStack,
  Button,
  Badge,
  Container,
  Flex,
  HStack,
  Icon,
  Card,
  CardBody,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaCar, FaArrowRight, FaSearch } from "react-icons/fa";
import { useBodyTypeStore } from "../stores/useBodyTypeStore";

const MotionBox = motion(Box);

export default function PopularBodyTypes() {
  const { bodyTypes, loading, fetchBodyTypes } = useBodyTypeStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (bodyTypes.length === 0) fetchBodyTypes();
  }, [fetchBodyTypes, bodyTypes.length]);

  // Show only 12 if showAll is false
  const displayedBodyTypes = showAll ? bodyTypes : bodyTypes.slice(0, 12);

  // Popular body types with custom icons mapping
  const bodyTypeIcons = {
    'SUV': '/assets/images/car-body/png/suv.png',
    'Sedan': '/assets/images/car-body/png/sedan.png',
    'Hatchback': '/assets/images/car-body/png/hatchback.png',
    'Coupe': '/assets/images/car-body/png/coupe.png',
    'Convertible': '/assets/images/car-body/png/convertible.png',
    'Wagon': '/assets/images/car-body/png/wagon.png',
    'Pickup': '/assets/images/car-body/png/pickup.png',
    'Van': '/assets/images/car-body/png/van.png',
    'Minivan': '/assets/images/car-body/png/minivan.png',
    'Truck': '/assets/images/car-body/png/truck.png',
    'Bus': '/assets/images/car-body/png/bus.png',
    'Sports Car': '/assets/images/car-body/png/sports.png',
  };

  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="7xl">
        {/* Section Header */}
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge 
            colorScheme="red" 
            fontSize="md" 
            px={4} 
            py={2} 
            borderRadius="full"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Browse By Type
          </Badge>
          <Heading size="2xl" color="gray.800" fontWeight="bold">
            Popular Vehicle Types
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Explore our extensive inventory organized by body style. Find the perfect vehicle type for your needs.
          </Text>
        </VStack>

        {/* Loader */}
        {loading && (
          <Flex justify="center" py={16}>
            <VStack spacing={4}>
              <Spinner size="xl" color="red.500" thickness="4px" />
              <Text color="gray.600">Loading vehicle types...</Text>
            </VStack>
          </Flex>
        )}

        {/* Body Types Grid */}
        {!loading && bodyTypes.length > 0 && (
          <>
            <SimpleGrid 
              columns={{ base: 2, sm: 3, md: 4, lg: 6 }} 
              spacing={6}
              mb={8}
            >
              {displayedBodyTypes.map((body, index) => {
                const iconPath = bodyTypeIcons[body.body_type_name as keyof typeof bodyTypeIcons] 
                  || `/assets/images/car-body/png/${(index % 12) + 1}.png`;
                
                return (
                  <Link
                    key={body.body_type_id}
                    href={`/vehicles?body_type=${encodeURIComponent(body.body_type_name)}`}
                    passHref
                  >
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        bg="white"
                        shadow="md"
                        border="1px"
                        borderColor="gray.200"
                        textAlign="center"
                        p={4}
                        height="100%"
                        _hover={{
                          shadow: "xl",
                          borderColor: "red.300",
                          transform: "translateY(-4px)",
                        }}
                        transition="all 0.3s ease-in-out"
                        cursor="pointer"
                        position="relative"
                        overflow="hidden"
                      >
                        {/* Hover Effect Overlay */}
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="linear-gradient(135deg, rgba(229, 62, 62, 0.05) 0%, transparent 100%)"
                          opacity={0}
                          _hover={{ opacity: 1 }}
                          transition="opacity 0.3s"
                        />

                        <CardBody p={0}>
                          {/* Icon Container - Transparent background */}
                          <Flex
                            w="100px"
                            h="80px"
                            bg="transparent"
                            borderRadius="xl"
                            align="center"
                            justify="center"
                            mx="auto"
                            mb={4}
                            position="relative"
                          >
                            <Box 
                              position="relative" 
                              w="80px" 
                              h="60px"
                              filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                            >
                              <Image
                                src={iconPath}
                                alt={body.body_type_name}
                                fill
                                sizes="80px"
                                style={{
                                  objectFit: "contain",
                                }}
                                priority={index < 6}
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.src = `/assets/images/car-body/png/${(index % 12) + 1}.png`;
                                }}
                              />
                            </Box>
                          </Flex>

                          {/* Body Type Name */}
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.800"
                            noOfLines={1}
                            mb={2}
                          >
                            {body.body_type_name}
                          </Text>

                          {/* View Vehicles Link */}
                          <HStack
                            spacing={1}
                            justify="center"
                            color="red.500"
                            fontSize="xs"
                            fontWeight="medium"
                            opacity={0.8}
                          >
                            <Text>View Vehicles</Text>
                            <Icon as={FaArrowRight} boxSize={2} />
                          </HStack>
                        </CardBody>
                      </Card>
                    </MotionBox>
                  </Link>
                );
              })}
            </SimpleGrid>

            {/* Show More / Show Less Button */}
            {bodyTypes.length > 12 && (
              <Flex justify="center" mt={8}>
                <Button
                  onClick={() => setShowAll(!showAll)}
                  colorScheme="red"
                  variant="outline"
                  size="lg"
                  rightIcon={<Icon as={showAll ? FaArrowRight : FaSearch} />}
                  px={8}
                  py={6}
                  fontWeight="bold"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  {showAll ? "Show Less Types" : "View All Body Types"}
                </Button>
              </Flex>
            )}
          </>
        )}

        {/* No Body Types */}
        {!loading && bodyTypes.length === 0 && (
          <Card bg="white" shadow="md" textAlign="center" py={12}>
            <CardBody>
              <VStack spacing={4}>
                <Icon as={FaCar} boxSize={12} color="gray.400" />
                <Heading size="md" color="gray.600">
                  No Vehicle Types Available
                </Heading>
                <Text color="gray.500">
                  Check back later for updated vehicle categories
                </Text>
                <Button colorScheme="red" as={Link} href="/vehicles">
                  Browse All Vehicles
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* CTA Section */}
        {!loading && bodyTypes.length > 0 && (
          <Card
            bg="linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
            color="white"
            mt={12}
            overflow="hidden"
          >
            <CardBody p={8}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} align="center">
                <Box>
                  <Heading size="lg" mb={4}>
                    Can't Find Your Preferred Type?
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Browse our complete inventory with thousands of vehicles across all categories.
                  </Text>
                </Box>
                <Flex justify={{ base: "center", lg: "end" }}>
                  <Button
                    colorScheme="red"
                    size="lg"
                    rightIcon={<Icon as={FaSearch} />}
                    fontWeight="bold"
                    px={8}
                    py={6}
                    as={Link}
                    href="/vehicles"
                  >
                    Search All Vehicles
                  </Button>
                </Flex>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}
      </Container>
    </Box>
  );
}