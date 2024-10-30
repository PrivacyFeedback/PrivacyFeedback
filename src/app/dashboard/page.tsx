'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Lock, Shield, UserCheck, Zap, PlusCircle, DollarSign, BarChart2, MessageSquare, Gift, ChevronRight, Activity, Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronDown, Filter } from "lucide-react"

interface Service {
  id: number
  name: string
  interactions: number
  feedbacks: number
  rating: number
}

const mockServices = [
  { id: 1, name: 'Service A', interactions: 100, feedbacks: 50, rating: 4.5 },
  { id: 2, name: 'Service B', interactions: 75, feedbacks: 30, rating: 3.8 },
  { id: 3, name: 'Service C', interactions: 120, feedbacks: 60, rating: 4.2 },
]

const mockFeedbacks = [
  {
    id: 1,
    serviceId: 1,
    date: '2023-06-01',
    overallRating: 4,
    responses: [
      { question: "How easy was it to use our service?", answer: "Very easy", rating: 5 },
      { question: "How satisfied are you with the customer support?", answer: "Quite satisfied", rating: 4 },
      { question: "How likely are you to recommend our service to others?", answer: "Very likely", rating: 5 },
      { question: "How well did our service meet your expectations?", answer: "Met expectations", rating: 4 },
      { question: "How would you rate the value for money of our service?", answer: "Good value", rating: 4 },
    ]
  },
  {
    id: 2,
    serviceId: 1,
    date: '2023-06-02',
    overallRating: 5,
    responses: [
      { question: "How easy was it to use our service?", answer: "Extremely easy", rating: 5 },
      { question: "How satisfied are you with the customer support?", answer: "Very satisfied", rating: 5 },
      { question: "How likely are you to recommend our service to others?", answer: "Definitely will recommend", rating: 5 },
      { question: "How well did our service meet your expectations?", answer: "Exceeded expectations", rating: 5 },
      { question: "How would you rate the value for money of our service?", answer: "Excellent value", rating: 5 },
    ]
  },
  {
    id: 3,
    serviceId: 1,
    date: '2023-06-03',
    overallRating: 3,
    responses: [
      { question: "How easy was it to use our service?", answer: "Somewhat easy", rating: 3 },
      { question: "How satisfied are you with the customer support?", answer: "Neutral", rating: 3 },
      { question: "How likely are you to recommend our service to others?", answer: "Might recommend", rating: 3 },
      { question: "How well did our service meet your expectations?", answer: "Met some expectations", rating: 3 },
      { question: "How would you rate the value for money of our service?", answer: "Fair value", rating: 3 },
    ]
  },
]

const mockAnalytics = [
  { name: 'Jan', interactions: 65, feedbacks: 40 },
  { name: 'Feb', interactions: 59, feedbacks: 30 },
  { name: 'Mar', interactions: 80, feedbacks: 50 },
  { name: 'Apr', interactions: 81, feedbacks: 55 },
  { name: 'May', interactions: 56, feedbacks: 35 },
  { name: 'Jun', interactions: 55, feedbacks: 40 },
]

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isAddingService, setIsAddingService] = useState(false)
  const { toast } = useToast()

  const handleAddService = (serviceData) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
      interactions: 0,
      feedbacks: 0,
      rating: 0,
    }
    setServices([...services, newService])
    setIsAddingService(false)
    toast({
      title: "Service Added",
      description: `Your new service ${serviceData.name} has been added successfully.`,
    })
  }

  const handleReward = (feedbackId) => {
    toast({
      title: "Reward Sent",
      description: `Reward has been sent for feedback ID: ${feedbackId}`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-6 py-4 bg-black text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <svg className="w-10 h-10" viewBox="0 0 864 528" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M477.902 320.988C471.752 323.09 466.453 326.446 460.017 326.583C453.919 326.712 448.562 325.186 443.744 321.421C427.204 308.496 410.717 295.5 394.001 282.806C385.68 276.488 382.527 268.246 383.83 258.3C386.571 237.386 389.7 216.523 392.561 195.624C393.826 186.38 398.655 179.956 407.207 176.397C426.886 168.207 446.603 160.108 466.296 151.95C475.406 148.177 483.893 149.239 491.685 155.249C508.564 168.267 525.356 181.401 542.275 194.367C552.007 201.826 552.544 211.948 551.044 222.788C548.472 241.38 545.758 259.955 543.403 278.575C542.073 289.094 537.098 296.642 527.235 300.722C510.926 307.468 494.585 314.14 477.902 320.988ZM480.263 305.707C487.126 302.854 493.988 300.001 500.87 297.141C499.966 294.864 498.393 294.104 497.114 293.109C476.867 277.373 456.16 262.188 436.524 245.725C427.798 238.411 420.775 237.382 410.434 242.107C401.94 245.988 396.894 249.781 396.85 259.779C396.827 264.994 397.562 268.813 401.596 271.943C418.437 285.006 435.269 298.083 452.114 311.142C455.391 313.682 458.949 314.368 462.891 312.736C468.428 310.445 473.999 308.236 480.263 305.707ZM523.711 196.816C516.633 191.417 509.555 186.017 501.756 180.068C500.673 188.18 499.731 195.205 498.798 202.23C495.913 223.95 493.091 245.679 490.077 267.38C489.691 270.158 490.621 271.657 492.669 273.201C498.646 277.708 504.495 282.385 510.406 286.981C517.872 292.787 528.21 289.232 529.656 279.871C532.923 258.718 535.669 237.485 538.666 216.29C539.395 211.134 537.635 207.273 533.318 204.321C530.165 202.166 527.272 199.63 523.711 196.816ZM440.649 216.038C454.504 210.323 468.338 204.554 482.234 198.939C484.848 197.883 486.306 196.392 486.647 193.553C487.459 186.791 488.406 180.045 489.365 173.302C489.563 171.91 489.487 170.758 488.546 169.588C483.874 163.778 477.163 161.899 470.218 164.726C451.245 172.447 432.312 180.266 413.329 187.963C408.493 189.923 405.984 193.418 405.344 198.481C404.782 202.928 403.863 207.348 403.595 211.81C403.21 218.214 401.181 224.471 401.577 232.042C414.817 226.625 427.381 221.486 440.649 216.038ZM479.912 239.695C481.083 231.083 482.254 222.471 483.582 212.704C468.436 218.903 454.445 224.629 439.313 230.821C451.992 241.396 463.894 250.645 477.027 260.376C478.07 252.93 478.935 246.755 479.912 239.695Z" fill="white"/>
            </svg>
            <h1 className="text-2xl font-bold">PrivateFeedback Dashboard</h1>
          </div>
          <nav className="space-x-4">
            <Button variant="ghost" className="text-white hover:text-gray-300">Services</Button>
            <Button variant="ghost" className="text-white hover:text-gray-300">Analytics</Button>
            <Button variant="ghost" className="text-white hover:text-gray-300">Settings</Button>
          </nav>
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
                      <CardTitle className="text-black">{service.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Rating: {service.rating.toFixed(1)} / 5
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

function AddServiceForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [feedbackQuestions, setFeedbackQuestions] = useState([{ type: 'rating', question: '' }])

  const handleAddQuestion = () => {
    setFeedbackQuestions([...feedbackQuestions, { type: 'rating', question: '' }])
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...feedbackQuestions]
    updatedQuestions[index][field] = value
    setFeedbackQuestions(updatedQuestions)
  }

  const handleSubmit = (e) => {
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
        {feedbackQuestions.map((q, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <Select
              value={q.type}
              onValueChange={(value) => handleQuestionChange(index, 'type', value)}
            >
              <SelectTrigger className="w-[180px] bg-white text-black border-gray-300">
                <SelectValue placeholder="Question Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating (0-5)</SelectItem>
                <SelectItem value="text">Short Answer</SelectItem>
                <SelectItem value="photo">Photo Upload</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
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

function ServiceDetails({ service, feedbacks, onBack, onReward }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [filterRating, setFilterRating] = useState('all')
  const [viewMode, setViewMode] = useState('individual')
  const itemsPerPage = 5

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date)
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
                <Select value={sortBy} onValueChange={setSortBy}>
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
                <Select value={viewMode} onValueChange={setViewMode}>
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

function IndividualFeedbackView({ feedbacks, onReward, currentPage, totalPages, setCurrentPage }) {
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
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{response.answer}</p>
                  <div className="flex items-center">
                    {response.rating >= 4 ? (
                      <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : response.rating <= 2 ? (
                      <ThumbsDown className="h-4 w-4 text-red-600 mr-1" />
                    ) : null}
                    <span className="text-sm font-semibold text-gray-600">{response.rating}/5</span>
                  </div>
                </div>
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

function AggregatedFeedbackView({ feedbacks }) {
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
                <div key={answerIndex} className="bg-gray-50 rounded p-3 flex justify-between items-center border border-gray-200">
                  <p className="text-gray-800">{answer.answer}</p>
                  <div className="flex items-center">
                    {answer.rating >= 4 ? (
                                            <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : answer.rating <= 2 ? (
                      <ThumbsDown className="h-4 w-4 text-red-600 mr-1" />
                    ) : null}
                    <span className="text-sm font-semibold text-gray-600">{answer.rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}