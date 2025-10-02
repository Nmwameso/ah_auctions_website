"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Image,
  Flex,
  Badge,
  HStack,
  Icon,
  Button,
  Card,
  CardBody,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { 
  FaSearch, 
  FaGavel, 
  FaShippingFast, 
  FaCar, 
  FaShieldAlt,
  FaGlobeAmericas,
  FaHeadset,
  FaMoneyBillWave
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

export default function Services() {
  const steps = [
    {
      title: "Search & Select",
      desc: "Browse thousands of vehicles from Japan's top auctions with detailed condition reports and photos.",
      icon: FaSearch,
      color: "red",
    },
    {
      title: "Bid & Win",
      desc: "Our experts place strategic bids on your behalf to secure the best deals at Japanese auctions.",
      icon: FaGavel,
      color: "orange",
    },
    {
      title: "Secure & Ship",
      desc: "We handle all payments, documentation, and arrange fast, reliable shipping to your destination.",
      icon: FaShippingFast,
      color: "blue",
    },
    {
      title: "Receive & Enjoy",
      desc: "Pick up your fully inspected vehicle at the port with all import paperwork completed.",
      icon: FaCar,
      color: "green",
    },
  ];

  const features = [
    {
      title: "Auction Access",
      desc: "Direct access to Japan's largest auction houses with real-time bidding",
      icon: FaGavel,
    },
    {
      title: "Vehicle Inspection",
      desc: "Comprehensive condition reports with detailed photos and ratings",
      icon: FaCar,
    },
    {
      title: "Global Shipping",
      desc: "Door-to-door shipping to major ports worldwide with tracking",
      icon: FaGlobeAmericas,
    },
    {
      title: "Buyer Protection",
      desc: "Secure transactions with money-back guarantee on misrepresented vehicles",
      icon: FaShieldAlt,
    },
    {
      title: "Expert Support",
      desc: "Dedicated support team available throughout the entire process",
      icon: FaHeadset,
    },
    {
      title: "Competitive Pricing",
      desc: "No hidden fees with transparent pricing and competitive auction bids",
      icon: FaMoneyBillWave,
    },
  ];

  return (
    <Box bg="gray.50" py={{ base: 12, md: 20 }}>
      <Container maxW="7xl">
        {/* Header Section */}
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge 
            colorScheme="red" 
            fontSize="lg" 
            px={4} 
            py={2} 
            borderRadius="full"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Our Services
          </Badge>
          <Heading as="h2" size="2xl" color="gray.800" fontWeight="bold">
            Import Vehicles from Japan Auctions
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl">
            Your trusted partner for seamless vehicle imports from Japan's top auction houses
          </Text>
        </VStack>

        {/* Process Steps */}
        <Box mb={20}>
          <VStack spacing={2} textAlign="center" mb={10}>
            <Heading as="h3" size="xl" color="gray.800">
              How It Works
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Simple 4-step process to import your dream vehicle
            </Text>
          </VStack>

          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 4 }} 
            spacing={8}
            position="relative"
          >
            {/* Connecting Line */}
            <Box
              position="absolute"
              top="60px"
              left="10%"
              right="10%"
              height="2px"
              bg="red.200"
              display={{ base: "none", lg: "block" }}
            />
            
            {steps.map((step, index) => (
              <Card 
                key={index}
                bg="white"
                shadow="lg"
                border="1px"
                borderColor="gray.200"
                textAlign="center"
                position="relative"
                _hover={{
                  shadow: "2xl",
                  transform: "translateY(-8px)",
                  borderColor: "red.300",
                }}
                transition="all 0.3s ease-in-out"
              >
                <CardBody p={6}>
                  {/* Step Number */}
                  <Flex
                    justify="center"
                    align="center"
                    w="60px"
                    h="60px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="xl"
                    fontWeight="bold"
                    mb={4}
                    mx="auto"
                    position="relative"
                    zIndex={2}
                  >
                    {index + 1}
                  </Flex>

                  {/* Icon */}
                  <Flex
                    justify="center"
                    align="center"
                    w="80px"
                    h="80px"
                    bg={`${step.color}.50`}
                    color={`${step.color}.500`}
                    borderRadius="xl"
                    mb={4}
                    mx="auto"
                  >
                    <Icon as={step.icon} boxSize={8} />
                  </Flex>

                  <Heading size="md" color="gray.800" mb={3}>
                    {step.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" lineHeight="tall">
                    {step.desc}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Features Grid */}
        <Box>
          <VStack spacing={2} textAlign="center" mb={10}>
            <Heading as="h3" size="xl" color="gray.800">
              Why Choose Us
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Experience the difference with our comprehensive service package
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {features.map((feature, index) => (
              <Card 
                key={index}
                bg="white"
                shadow="md"
                border="1px"
                borderColor="gray.200"
                _hover={{
                  shadow: "lg",
                  borderColor: "red.300",
                }}
                transition="all 0.2s"
              >
                <CardBody>
                  <HStack align="start" spacing={4}>
                    <Flex
                      w="50px"
                      h="50px"
                      bg="red.50"
                      color="red.500"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={feature.icon} boxSize={5} />
                    </Flex>
                    <Box>
                      <Heading size="sm" color="gray.800" mb={2}>
                        {feature.title}
                      </Heading>
                      <Text fontSize="sm" color="gray.600" lineHeight="tall">
                        {feature.desc}
                      </Text>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Card 
          bg="linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
          color="white"
          mt={16}
          overflow="hidden"
        >
          <CardBody p={8}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} align="center">
              <Box>
                <Heading size="lg" mb={4}>
                  Ready to Start Bidding?
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  Join thousands of satisfied customers who have imported their dream vehicles through our platform.
                </Text>
              </Box>
              <VStack spacing={4}>
                <Button
                  colorScheme="red"
                  size="lg"
                  w="full"
                  rightIcon={<FiArrowRight />}
                  fontWeight="bold"
                  py={6}
                  fontSize="lg"
                >
                  Browse Live Auctions
                </Button>
                <Button
                  variant="outline"
                  color="white"
                  borderColor="white"
                  size="lg"
                  w="full"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Contact Our Experts
                </Button>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Stats Section */}
        <SimpleGrid 
          columns={{ base: 2, md: 4 }} 
          spacing={8} 
          mt={16}
          textAlign="center"
        >
          <VStack>
            <Heading size="2xl" color="red.500">50,000+</Heading>
            <Text color="gray.600" fontWeight="medium">Vehicles Sold</Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="red.500">15+</Heading>
            <Text color="gray.600" fontWeight="medium">Years Experience</Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="red.500">98%</Heading>
            <Text color="gray.600" fontWeight="medium">Customer Satisfaction</Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="red.500">50+</Heading>
            <Text color="gray.600" fontWeight="medium">Countries Served</Text>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}