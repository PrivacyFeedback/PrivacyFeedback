// @ts-nocheck

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Lock, Shield, UserCheck, Zap, PlusCircle, DollarSign, BarChart2, MessageSquare, Gift, ChevronRight, Activity, Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronDown, Filter } from "lucide-react"
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react"
import { ethers, BrowserProvider, Contract, formatUnits } from 'ethers'
import contractABI from "../../contract/abi.json" assert { type: "json" };
import contractAddress from "../../contract/address.json" assert { type: "json" };
import { toast } from 'react-hot-toast';
import { pinata } from "@/utils/config";

interface Service {
  id: number
  ipfsUrl: string|""
  name: string
  description: string
  interactions: number
  feedbacks: number
}

interface FeedbackResponse {
  question: string
  answer: string
}

interface Feedback {
  id: number
  serviceId: number
  date: string
  overallRating: number
  responses: FeedbackResponse[]
}

interface Analytics {
  name: string
  interactions: number
  feedbacks: number
}

interface ServiceFormData {
  name: string
  description: string
  feedbackQuestions: Array<string>
}

interface AddServiceFormProps {
  onSubmit: (data: ServiceFormData) => void
}

interface ServiceDetailsProps {
  service: Service
  feedbacks: Feedback[]
  onBack: () => void
  onReward: (feedbackId: number) => void
}

interface IndividualFeedbackViewProps {
  feedbacks: Feedback[]
  onReward: (feedbackId: number) => void
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

interface AggregatedFeedbackViewProps {
  feedbacks: Feedback[]
}

let mockServices: Service[]  = [
]

const mockFeedbacks: Feedback[] = [ 
  {
    id: 1,
    serviceId: 1,
    date: '2023-06-01',
    overallRating: 4,
    responses: [
      { question: "How was your experience with our customer support?", answer: "The support was very helpful and quick to respond." },
      { question: "What could we improve about our chat support?", answer: "Maybe add a feature to easily share screenshots." },
      { question: "Would you use our chat support again?", answer: "Definitely, it was very convenient." },
    ]
  },
  {
    id: 2,
    serviceId: 1,
    date: '2023-06-02',
    overallRating: 5,
    responses: [
      { question: "How was your experience with our customer support?", answer: "Excellent! The agent solved my problem quickly." },
      { question: "What could we improve about our chat support?", answer: "Nothing comes to mind, it was great as is." },
      { question: "Would you use our chat support again?", answer: "Absolutely, it's my preferred way to get help." },
    ]
  },
  {
    id: 3,
    serviceId: 1,
    date: '2023-06-03',
    overallRating: 3,
    responses: [
      { question: "How was your experience with our customer support?", answer: "It was okay, but took longer than I expected." },
      { question: "What could we improve about our chat support?", answer: "Faster response times would be appreciated." },
      { question: "Would you use our chat support again?", answer: "Probably, if I can't find the answer in the FAQ." },
    ]
  },
]

const mockAnalytics: Analytics[] = [
  { name: 'Jan', interactions: 65, feedbacks: 40 },
  { name: 'Feb', interactions: 59, feedbacks: 30 },
  { name: 'Mar', interactions: 80, feedbacks: 50 },
  { name: 'Apr', interactions: 81, feedbacks: 55 },
  { name: 'May', interactions: 56, feedbacks: 35 },
  { name: 'Jun', interactions: 55, feedbacks: 40 },
]

function convertStringToUint32(string, obj) {
  if (string.length > 62) {
      throw new Error("String must be less than or equal to 62 characters.");
  }
  const byteArray = Buffer.from(string, 'ascii');
  const length = byteArray.length;
  const part1 = Buffer.alloc(32);
  const part2 = Buffer.alloc(32);
  part1[0] = length;
  byteArray.copy(part1, 1, 0, Math.min(length, 31));
  if (length > 31) {
      byteArray.copy(part2, 0, 31);
  }
  let part1Uint = '0x' + part1.toString('hex');
  let part2Uint = '0x' + part2.toString('hex');
  obj.part1 = part1Uint;
  obj.part2 = part2Uint;
}

function decodeUint32ToString(part1Uint, part2Uint) {
  const part1 = Buffer.from(part1Uint.toString(16).padStart(64, '0'), 'hex');
  const part2 = Buffer.from(part2Uint.toString(16).padStart(64, '0'), 'hex');
  const length = part1[0];
  const fullBuffer = Buffer.concat([part1.slice(1, 32), part2]).slice(0, length);
  return fullBuffer.toString('ascii');
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isAddingService, setIsAddingService] = useState(false)
  const { walletProvider } = useAppKitProvider()
  const { address, isConnected, caipAddress, status } = useAppKitAccount()

  const getContract = async () => {
    if(!isConnected) {
      console.log('Not connected!');
      toast.error("Wallet not connected")
      return;
    }
    console.log('Connected!');
    toast.success("Wallet connected")
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(contractAddress.address, contractABI, signer);
      toast.success("Contract fetched successfully")
      return contract;
    } catch (error) {
      toast.error(error.message)
    }
  }

  const uploadServiceToIPFS = (serviceData: ServiceFormData): Promise<string> => {
    return fetch("/api/service", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    })
    .then(response => response.json());
  };
  
  const addService = (serviceData: ServiceFormData, services: Service[], setServices: (services: Service[]) => void) => {
    const promise = uploadServiceToIPFS(serviceData)
      .then(ipfsUrl => {
        let obj = { part1: "", part2: "" };
        convertStringToUint32(ipfsUrl, obj);
        return getContract().then(contract => 
          contract.registerService(BigInt(obj.part1), BigInt(obj.part2))
        );
      })
      .then(tx => tx.wait())
      .then(receipt => {
        console.log(receipt);
        const newService: Service = {
          id: services.length + 1,
          name: serviceData.name,
          description: serviceData.description,
          interactions: 0,
          feedbacks: 0,
        }
        setServices([...services, newService]);
      });
  
    toast.promise(promise, {
      loading: 'Adding service...',
      success: 'Service added successfully',
      error: 'Error adding service',
    });
  
    return promise;
  };

  const handleAddService = async(serviceData: ServiceFormData) => {
    setIsAddingService(false)
    addService(serviceData, services, setServices)
      .catch(error => toast.error(error.message));
  }

  const handleReward = (feedbackId: number) => {
    toast.success(`Reward sent for feedback ID: ${feedbackId}`)
  }

  const fetchServices = async () => {
    try {
      const contract = await getContract();
      const serviceIds = await contract.getServiceIdsByOwner(address);
      const servicesTemp = await Promise.all(serviceIds.map(async (serviceId) => {
        const serviceMetaData = await contract.getServiceMetadataByServiceId(BigInt(serviceId));
        const IpfsHash = decodeUint32ToString(BigInt(serviceMetaData[0]), BigInt(serviceMetaData[1]));
        const ipfsUrl = await pinata.gateways.convert(IpfsHash);
        const response = await fetch(ipfsUrl);
        const data = await response.json();
        const feedbacks = await contract.getTotalFeedbacks(BigInt(serviceId));
        const interactions = await contract.getTotalInteractions(BigInt(serviceId));
        const newService: Service = {
          id: serviceId.toString(),
          ipfsUrl: IpfsHash,
          name: data.name,
          description: data.description,
          interactions: interactions.toString(),
          feedbacks: feedbacks.toString(),
        }
        console.log(newService);
        // mockServices.push(newService);
        setServices(oldServices => [...oldServices, newService]);
      }))
      // setServices(mockServices)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(isConnected){
      toast.success("Wallet connected")
      fetchServices();
    } else {
      toast.error("Wallet not connected")
    }
  }, [isConnected])

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-6 py-4 bg-black text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">PrivateFeedback</h1>
          </div>
          <nav className="flex space-x-2">
            <Button variant="ghost" className="text-white hover:text-black">Services</Button>
            <Button variant="ghost" className="text-white hover:text-black">Analytics</Button>
          </nav>
          <w3m-button size='sm'/>
        </div>
      </header>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto">
          {!selectedService ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-black">Your Services</h2>
                <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                  <DialogTrigger asChild>
                    <Button className="bg-black hover:bg-gray-800 text-white">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white text-black">
                    <DialogHeader>
                      <DialogTitle className="text-black">Add New Service</DialogTitle>
                      <DialogDescription className="text-gray-600">Enter the details for your new service.</DialogDescription>
                    </DialogHeader>
                    <AddServiceForm onSubmit={handleAddService} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-black">{service.id}: {service.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-green-600" />
                          <span>{service.interactions} Interactions</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-yellow-600" />
                          <span>{service.feedbacks} Feedbacks</span>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedService(service)} variant="outline" className="w-full text-black border-black hover:bg-black hover:text-white">
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Overall Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#4B5563" />
                        <YAxis stroke="#4B5563" />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                        <Legend />
                        <Bar dataKey="interactions" fill="#000000" />
                        <Bar dataKey="feedbacks" fill="#4B5563" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ServiceDetails
              service={selectedService}
              feedbacks={mockFeedbacks.filter(f => f.serviceId === selectedService.id)}
              onBack={() => setSelectedService(null)}
              onReward={handleReward}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function AddServiceForm({ onSubmit }: AddServiceFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [feedbackQuestions, setFeedbackQuestions] = useState<string[]>([''])

  const handleAddQuestion = () => {
    setFeedbackQuestions([...feedbackQuestions, ''])
  }

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...feedbackQuestions]
    updatedQuestions[index] = value
    setFeedbackQuestions(updatedQuestions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description, feedbackQuestions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-black">Service Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-white text-black border-gray-300" />
      </div>
      <div>
        <Label htmlFor="description" className="text-black">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-white text-black border-gray-300" />
      </div>
      <div>
        <Label className="text-black">Feedback Questions</Label>
        {feedbackQuestions.map((question, index) => (
          <div key={index} className="mt-2">
            <Input
              placeholder="Enter your question"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
              className="bg-white text-black border-gray-300"
            />
          </div>
        ))}
        <Button type="button" onClick={handleAddQuestion} variant="outline" className="mt-2 text-black border-black hover:bg-black hover:text-white">
          Add Question
        </Button>
      </div>
      <Button type="submit" className="bg-black hover:bg-gray-800 text-white">Add Service</Button>
    </form>
  )
}

function ServiceDetails({ service, feedbacks, onBack, onReward }: ServiceDetailsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'individual' | 'aggregated'>('individual')
  const itemsPerPage = 5

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'rating') {
      return b.overallRating - a.overallRating
    }
    return 0
  })

  const filteredFeedbacks = sortedFeedbacks.filter(feedback => {
    if (filterRating === 'all') return true
    return feedback.overallRating === parseInt(filterRating)
  })

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const averageRating = feedbacks.reduce((sum, feedback) => sum + feedback.overallRating, 0) / feedbacks.length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-black">{service.name}</h2>
        <Button onClick={onBack} variant="outline" className="text-black border-black hover:bg-black hover:text-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Services
        </Button>
      </div>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Service Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{service.description}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Service Statistics</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Interactions:</span>
                <span className="font-semibold">{service.interactions}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Feedbacks:</span>
                <span className="font-semibold">{service.feedbacks}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-semibold flex items-center">
                  {averageRating.toFixed(1)}
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-current" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-black">Feedback Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-gray-600">Sort by:</Label>
                <Select value={sortBy} onValueChange={(value: 'date' | 'rating') => setSortBy(value)}>
                  <SelectTrigger id="sort" className="w-[180px] bg-white text-black border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="filter" className="text-gray-600">Filter by rating:</Label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger id="filter" className="w-[180px] bg-white text-black border-gray-300">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="viewMode" className="text-gray-600">View Mode:</Label>
                <Select value={viewMode} onValueChange={(value: 'individual' | 'aggregated') => setViewMode(value)}>
                  <SelectTrigger id="viewMode" className="w-[180px] bg-white text-black border-gray-300">
                    <SelectValue placeholder="View Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Feedbacks</SelectItem>
                    <SelectItem value="aggregated">Aggregated View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {viewMode === 'individual' ? (
              <IndividualFeedbackView
                feedbacks={paginatedFeedbacks}
                onReward={onReward}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <AggregatedFeedbackView feedbacks={feedbacks} />
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Service Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="interactions" fill="#000000" />
                <Bar dataKey="feedbacks" fill="#4B5563" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IndividualFeedbackView({ 
  feedbacks, 
  onReward, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}: IndividualFeedbackViewProps) {
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-600">Feedback ID: {feedback.id}</span>
            <span className="text-sm text-gray-600">{feedback.date}</span>
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-black flex items-center">
              Overall Rating: {feedback.overallRating}
              <Star className="h-5 w-5 ml-1 text-yellow-400 fill-current" />
            </span>
          </div>
          <div className="space-y-3">
            {feedback.responses.map((response, index) => (
              <div key={index} className="bg-white rounded p-3 border border-gray-200">
                <p className="text-gray-800 font-medium mb-1">{response.question}</p>
                <p className="text-gray-600">{response.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => onReward(feedback.id)} size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Gift className="mr-2 h-4 w-4" /> Reward
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="text-black border-black hover:bg-black hover:text-white"
        >
          Previous
        </Button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="text-black border-black hover:bg-black hover:text-white"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function AggregatedFeedbackView({ feedbacks }: AggregatedFeedbackViewProps) {
  const aggregatedResponses = feedbacks[0].responses.map(response => ({
    question: response.question,
    answers: feedbacks.map(feedback => 
      feedback.responses.find(r => r.question === response.question)
    )
  }))

  return (
    <div className="space-y-6">
      {aggregatedResponses.map((aggregatedResponse, index) => (
        <Card key={index} className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">{aggregatedResponse.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aggregatedResponse.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="bg-gray-50 rounded p-3 border border-gray-200">
                  <p className="text-gray-800">{answer.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}